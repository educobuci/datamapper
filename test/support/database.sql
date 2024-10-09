CREATE TABLE public.products
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    name character varying(128) COLLATE pg_catalog."default" NOT NULL,
    description character varying(2048) COLLATE pg_catalog."default",
    price numeric(8, 2) NOT NULL,
    images character varying(512)[] COLLATE pg_catalog."default",
    created_at timestamp(0) with time zone NOT NULL DEFAULT now(),
    category character varying(128),
    archived boolean DEFAULT false,
    CONSTRAINT products_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;