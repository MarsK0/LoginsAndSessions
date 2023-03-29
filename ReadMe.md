#Logins & Sessions

###Repositório criado para estudar e praticar os conceitos de JWT, Http Only Cookies, sistemas de login e sessões, criando um app simples, com um front-end básico em React TS e um back-end em Node com typescript e banco de dados SQL (Postgres).

###Comandos SQL para criação das tabelas:

```sql
CREATE TABLE public.modulos (
	id serial4 NOT NULL,
	modulo varchar NOT NULL,
	CONSTRAINT pk_modulos PRIMARY KEY (id),
	CONSTRAINT uc_modulos UNIQUE (modulo)
);
```

```sql
CREATE TABLE public.usuarios (
	id serial4 NOT NULL,
	nome varchar NOT NULL,
	senha varchar NOT NULL,
	ativo bool NOT NULL DEFAULT true,
	"admin" bool NOT NULL DEFAULT false,
	tempo_sessao_minutos int4 NOT NULL DEFAULT 15,
	CONSTRAINT chk_tempo_sessao_minutos CHECK (((tempo_sessao_minutos >= 1) AND (tempo_sessao_minutos <= 30))),
	CONSTRAINT pk_usuarios PRIMARY KEY (id),
	CONSTRAINT uc_usuarios_nome UNIQUE (nome)
);
```

```sql
  CREATE TABLE public.permissoes (
	id serial4 NOT NULL,
	id_modulos int4 NOT NULL,
	id_usuarios int4 NOT NULL,
	CONSTRAINT pk_permissoes PRIMARY KEY (id)
);
```
```sql
ALTER TABLE public.permissoes ADD CONSTRAINT fk_permissoes FOREIGN KEY (id_modulos) REFERENCES public.modulos(id);
ALTER TABLE public.permissoes ADD CONSTRAINT fk_usuarios FOREIGN KEY (id_usuarios) REFERENCES public.usuarios(id);
```
```sql
CREATE TABLE public.tokens (
	id int4 NOT NULL DEFAULT nextval('tokens'::regclass),
	"token" varchar NOT NULL,
	id_usuario int4 NOT NULL,
	valido bool NOT NULL DEFAULT true,
	CONSTRAINT pk_token_lista_negra PRIMARY KEY (id),
	CONSTRAINT uc_token_lista_negra_token UNIQUE (token)
);

```
```sql
ALTER TABLE public.tokens ADD CONSTRAINT fk_usuarios FOREIGN KEY (id_usuario) REFERENCES public.usuarios(id);
```