--
-- PostgreSQL database dump
--

-- Dumped from database version 11.2 (Debian 11.2-1.pgdg90+1)
-- Dumped by pg_dump version 11.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

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
-- Data for Name: config; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.config (conf_id, p1, p2, p3, p4, p5, p6) FROM stdin;
1	1	2	3	4	5	6
2	2	4	6	8	10	12
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
-- Name: config_conf_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.config_conf_id_seq', 1, false);


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
-- PostgreSQL database dump complete
--

