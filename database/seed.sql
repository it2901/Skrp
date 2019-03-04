--
-- PostgreSQL database dump
--

-- Dumped from database version 11.2 (Debian 11.2-1.pgdg90+1)
-- Dumped by pg_dump version 11.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: adaption; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.adaption (
    adaption_id integer NOT NULL
);


ALTER TABLE public.adaption OWNER TO postgres;

--
-- Name: adaption_adaption_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.adaption_adaption_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.adaption_adaption_id_seq OWNER TO postgres;

--
-- Name: adaption_adaption_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.adaption_adaption_id_seq OWNED BY public.adaption.adaption_id;


--
-- Name: device; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.device (
    device_id integer NOT NULL
);


ALTER TABLE public.device OWNER TO postgres;

--
-- Name: device_device_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.device_device_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.device_device_id_seq OWNER TO postgres;

--
-- Name: device_device_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.device_device_id_seq OWNED BY public.device.device_id;


--
-- Name: net_json_graph; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.net_json_graph (
    net_json_graph_id integer NOT NULL,
    content jsonb NOT NULL,
    created timestamp with time zone NOT NULL
);


ALTER TABLE public.net_json_graph OWNER TO postgres;

--
-- Name: net_json_graph_net_json_graph_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.net_json_graph_net_json_graph_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.net_json_graph_net_json_graph_id_seq OWNER TO postgres;

--
-- Name: net_json_graph_net_json_graph_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.net_json_graph_net_json_graph_id_seq OWNED BY public.net_json_graph.net_json_graph_id;


--
-- Name: position_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.position_log (
    device_id integer NOT NULL,
    lat double precision NOT NULL,
    lng double precision NOT NULL,
    created timestamp with time zone NOT NULL
);


ALTER TABLE public.position_log OWNER TO postgres;

--
-- Name: system_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.system_log (
    system_log_id integer NOT NULL,
    device_id integer NOT NULL,
    adaption_id integer,
    description text NOT NULL,
    created timestamp with time zone NOT NULL
);


ALTER TABLE public.system_log OWNER TO postgres;

--
-- Name: system_log_system_log_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.system_log_system_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.system_log_system_log_id_seq OWNER TO postgres;

--
-- Name: system_log_system_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.system_log_system_log_id_seq OWNED BY public.system_log.system_log_id;


--
-- Name: adaption adaption_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.adaption ALTER COLUMN adaption_id SET DEFAULT nextval('public.adaption_adaption_id_seq'::regclass);


--
-- Name: device device_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.device ALTER COLUMN device_id SET DEFAULT nextval('public.device_device_id_seq'::regclass);


--
-- Name: net_json_graph net_json_graph_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.net_json_graph ALTER COLUMN net_json_graph_id SET DEFAULT nextval('public.net_json_graph_net_json_graph_id_seq'::regclass);


--
-- Name: system_log system_log_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_log ALTER COLUMN system_log_id SET DEFAULT nextval('public.system_log_system_log_id_seq'::regclass);


--
-- Data for Name: adaption; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.adaption (adaption_id) FROM stdin;
2
1
5
4
3
\.


--
-- Data for Name: device; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.device (device_id) FROM stdin;
1
2
3
4
5
\.


--
-- Data for Name: net_json_graph; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.net_json_graph (net_json_graph_id, content, created) FROM stdin;
\.


--
-- Data for Name: position_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.position_log (device_id, lat, lng, created) FROM stdin;
\.


--
-- Data for Name: system_log; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.system_log (system_log_id, device_id, adaption_id, description, created) FROM stdin;
4	1	2	This is database	2012-02-09 10:38:01+00
1	1	1	Compress	2019-03-04 09:46:06.693675+00
2	2	3	Switch protocol	2019-03-04 09:46:31.69302+00
3	3	3	Disable compression	2019-03-04 09:47:03.291785+00
\.


--
-- Name: adaption_adaption_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.adaption_adaption_id_seq', 1, false);


--
-- Name: device_device_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.device_device_id_seq', 1, false);


--
-- Name: net_json_graph_net_json_graph_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.net_json_graph_net_json_graph_id_seq', 1, false);


--
-- Name: system_log_system_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.system_log_system_log_id_seq', 4, true);


--
-- Name: adaption adaption_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.adaption
    ADD CONSTRAINT adaption_pkey PRIMARY KEY (adaption_id);


--
-- Name: device device_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.device
    ADD CONSTRAINT device_pkey PRIMARY KEY (device_id);


--
-- Name: net_json_graph net_json_graph_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.net_json_graph
    ADD CONSTRAINT net_json_graph_pkey PRIMARY KEY (net_json_graph_id);


--
-- Name: system_log system_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_log
    ADD CONSTRAINT system_log_pkey PRIMARY KEY (system_log_id);


--
-- Name: position_log position_log_device_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.position_log
    ADD CONSTRAINT position_log_device_id_fkey FOREIGN KEY (device_id) REFERENCES public.device(device_id);


--
-- Name: system_log system_log_adaption_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_log
    ADD CONSTRAINT system_log_adaption_id_fkey FOREIGN KEY (adaption_id) REFERENCES public.adaption(adaption_id);


--
-- Name: system_log system_log_device_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_log
    ADD CONSTRAINT system_log_device_id_fkey FOREIGN KEY (device_id) REFERENCES public.device(device_id);


--
-- PostgreSQL database dump complete
--

