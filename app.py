# -*- coding: utf-8 -*-
from flask import Flask, render_template, request, redirect, session, jsonify, url_for
from functools import wraps
import pymysql
import traceback
import sys
import codecs
from datetime import datetime, timezone

sys.stdout = codecs.getwriter("latin1")(sys.stdout.detach())

app = Flask(__name__)
app.secret_key = 'chave_secreta_segura'

credenciais = {
    'recepcionista': '1234',
    'enfermeira': '1234',
    'medico': '1234'
}


def login_requerido(perfil):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if 'perfil' not in session or session['perfil'] != perfil:
                return redirect(url_for('login')) 
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def conectar():
    return pymysql.connect(
        host='localhost',
        user='root',
        password='',
        database='sistema_hospitalar',
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        perfil = request.form['perfil']
        senha = request.form['senha']
        if perfil in credenciais and credenciais[perfil] == senha:
            session['perfil'] = perfil
            return redirect(url_for(f'pagina_{perfil}')) 
        else:
            return "Credenciais inválidas", 403
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('perfil', None)
    return redirect(url_for('login'))

@app.route('/')
def index():
    return redirect(url_for('login'))

@app.route('/recepcionista')
@login_requerido('recepcionista')
def pagina_recepcionista():
    return render_template('recepcionista.html')

@app.route('/recepcionista/cadastrar', methods=['GET', 'POST'])
@login_requerido('recepcionista')
def cadastrar_paciente():
    conn = None
    try:
        if request.method == 'POST':
            nome = request.form['nome']
            data_nascimento = request.form['data_nascimento']
            cpf = request.form['cpf']
            sexo = request.form['sexo']

            if not all([nome, cpf, data_nascimento, sexo]):
                return "Erro: Todos os campos são obrigatórios.", 400

            conn = conectar()
            with conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO pacientes (nome, data_nascimento, cpf, sexo)
                    VALUES (%s, %s, %s, %s)
                """, (nome, data_nascimento, cpf, sexo))
                conn.commit()
            return redirect(url_for('pagina_recepcionista'))
        
        return render_template('cadastrar_paciente.html')

    except pymysql.err.IntegrityError as e: 
        error_code, error_message = e.args
        if error_code == 1062 and 'cpf' in error_message.lower():
            return f"Erro: O CPF '{cpf}' já está cadastrado. Por favor, verifique os dados.", 400
        else:
            traceback.print_exc()
            return "Erro de integridade de dados ao cadastrar.", 500
    except Exception as e: 
        print("--- OCORREU UM ERRO AO CADASTRAR PACIENTE (GERAL) ---")
        traceback.print_exc()
        return "Erro ao cadastrar paciente. Verifique o console do servidor para detalhes.", 500
    finally:
        if conn and conn.open:
            conn.close()


@app.route('/enfermeira')
@login_requerido('enfermeira')
def pagina_enfermeira():
    return render_template('enfermeira.html')

@app.route('/medico')
@login_requerido('medico')
def pagina_medico():
    return render_template('medico.html')


@app.route('/enfermeira/triagem', methods=['GET', 'POST'])
@login_requerido('enfermeira')
def triagem():
    conn = None
    try:
        conn = conectar()
        if request.method == 'GET':
            with conn.cursor() as cur:
                cur.execute("SELECT id, nome, cpf FROM pacientes ORDER BY nome ASC")
                pacientes = cur.fetchall()
            return render_template('triagem.html', pacientes=pacientes)

        if request.method == 'POST':
            paciente_id = request.form['paciente_id']
            pressao = request.form['pressao']
            temperatura = request.form['temperatura']
            frequencia = request.form['frequencia']
            observacoes = request.form['observacoes']
            prioridade = int(request.form['prioridade'])
            data_hora_triagem = datetime.now(timezone.utc)


            with conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO triagem (paciente_id, pressao, temperatura, frequencia, observacoes, prioridade, data_hora_triagem)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, (paciente_id, pressao, temperatura, frequencia, observacoes, prioridade, data_hora_triagem))
                conn.commit()
            return redirect(url_for('pagina_enfermeira'))
            
    except pymysql.MySQLError as e:
        print(f"Erro de banco de dados na triagem: {e}")
        traceback.print_exc()
        return "Erro ao processar a triagem devido a um problema no banco de dados.", 500
    except Exception as e:
        print(f"Erro geral na triagem: {e}")
        traceback.print_exc()
        # Mantenha o log em arquivo se desejar, mas use 'a' para append
        with open("erro_triagem_geral.log", "a", encoding="utf-8") as f:
            f.write(f"{datetime.now()}: {traceback.format_exc()}\n")
        return "Erro ao registrar triagem.", 500
    finally:
        if conn and conn.open:
            conn.close()
    
    # Fallback, idealmente não alcançado
    return "Ocorreu um erro inesperado no fluxo da triagem.", 500

@app.route('/medico/fila')
@login_requerido('medico')
def medico_fila():
    conn = None
    try:
        conn = conectar()
        with conn.cursor() as cur:
            cur.execute("""
                SELECT t.id as triagem_id, p.nome as nome_paciente, t.prioridade, t.data_hora_triagem
                FROM triagem t
                JOIN pacientes p ON t.paciente_id = p.id
                WHERE t.status_atendimento = 'aguardando'
                ORDER BY t.prioridade ASC, t.data_hora_triagem ASC
            """)
            fila_db = cur.fetchall()
        return jsonify(fila_db) 
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Erro ao buscar fila"}), 500
    finally:
        if conn and conn.open:
            conn.close()


@app.route('/medico/chamar')
@login_requerido('medico')
def chamar_paciente():
    conn = None
    try:
        conn = conectar()
        with conn.cursor() as cur:
            cur.execute("""
                SELECT t.id as triagem_id, p.id as paciente_id, p.nome as nome_paciente, 
                       t.pressao, t.temperatura, t.frequencia, t.observacoes, t.prioridade, t.data_hora_triagem
                FROM triagem t
                JOIN pacientes p ON t.paciente_id = p.id
                WHERE t.status_atendimento = 'aguardando'
                ORDER BY t.prioridade ASC, t.data_hora_triagem ASC
                LIMIT 1
            """)
            paciente_a_chamar = cur.fetchone()

            if not paciente_a_chamar:
                return jsonify({"message": "Fila vazia"}), 200 

            triagem_id_chamada = paciente_a_chamar['triagem_id']

            cur.execute("""
                UPDATE triagem SET status_atendimento = 'em_atendimento'
                WHERE id = %s
            """, (triagem_id_chamada,))
            conn.commit()
            return jsonify(paciente_a_chamar)

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Erro ao chamar paciente"}), 500
    finally:
        if conn and conn.open:
            conn.close()

if __name__ == '__main__':
    app.run(debug=True)