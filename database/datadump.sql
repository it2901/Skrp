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
-- Data for Name: device; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.device (device_id) FROM stdin;
1
2
3
\.


--
-- Data for Name: config; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.config (config_id, device_id, config, created) FROM stdin;
1	1	{"param1": 20, "param2": 40, "param3": 200}	2019-04-12 07:39:11.230053+00
2	2	{"param1": 18, "param2": 70, "param3": 200}	2019-04-12 07:39:21.996719+00
3	1	{"a": 2, "b": 20}	2019-04-21 14:29:36.339774+00
4	1	{"a": 2, "b": 20}	2019-04-21 14:29:56.054994+00
5	1	{"param1": 2, "param2": 20}	2019-04-21 14:30:05.801186+00
6	2	{"param21": 112, "param52": 21231230}	2019-04-21 14:30:34.32779+00
7	1	{"param1": 12, "param2": 70, "param3": 200}	2019-04-21 14:35:30.216878+00
\.


--
-- Data for Name: adaption; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.adaption (adaption_id, adaption_type, adaption_description, config_id) FROM stdin;
1	compress	Make the things smaller	1
2	switch prot	change protocol	2
3	param1	update value	3
4	param2	update value	4
5	param3	update value	5
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
1	1	1	Disable compression	2019-04-12 07:55:56.854202+00
2	2	2	Switching protocol	2019-04-12 07:57:33.376585+00
3	1	1	test	2019-04-22 19:36:40.822848+00
4	1	\N	test	2019-04-22 19:37:05.657806+00
5	1	\N	test	2019-04-29 18:33:49.731702+00
6	1	1	test	2019-04-29 18:33:55.283602+00
\.


--
-- Name: adaption_adaption_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.adaption_adaption_id_seq', 1, false);


--
-- Name: config_config_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.config_config_id_seq', 7, true);


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

SELECT pg_catalog.setval('public.system_log_system_log_id_seq', 6, true);

insert into network_collection (collection) values('{"type":"NetworkCollection","collection":[{"type":"NetworkCollection","collection":[{"type":"NetworkGraph","protocol":"olsrv2","version":"1.0.7","revision":"rudi7","metric":"rudi","label":"RuDi Network-7","nodes":[{"id":"192.178.1.100","label":"NODE-7A"},{"id":"192.177.1.100","label":"NODE-7B"},{"id":"192.166.1.100","label":"NODE-C"},{"id":"192.175.1.100","label":"NODE-7D"}],"links":[{"source":"192.178.1.100","target":"192.177.1.100","cost":6,"properties":{},"cost_text":"1020 bit/s"},{"source":"192.177.1.100","target":"192.178.1.100","cost":6,"properties":{},"cost_text":"1020 bit/s"},{"source":"192.177.1.100","target":"192.166.1.100","cost":6,"properties":{},"cost_text":"1020 bit/s"},{"source":"192.166.1.100","target":"192.177.1.100","cost":6,"properties":{},"cost_text":"1020 bit/s"},{"source":"192.175.1.100","target":"192.166.1.100","cost":6,"cost_text":"1020 bit/s"},{"source":"192.166.1.100","target":"192.175.1.100","cost":6,"properties":{},"cost_text":"1020 bit/s"},{"source":"192.175.1.100","target":"192.178.1.100","cost":6,"properties":{},"cost_text":"1020 bit/s"},{"source":"192.178.1.100","target":"192.175.1.100","cost":6,"properties":{},"cost_text":"1020 bit/s"}],"router_id":"192.178.1.100","topology_id":"topology_rudi"},{"type":"NetworkGraph","protocol":"olsrv2","version":"1.0.1","revision":"rudi2080212","metric":"rudi","label":"RuDi simulated Network","nodes":[{"id":"192.168.1.100","label":"NODE-A"},{"id":"192.167.1.100","label":"NODE-B"},{"id":"192.166.1.100","label":"NODE-C"},{"id":"192.165.1.100","label":"NODE-D"}],"links":[{"source":"192.168.1.100","target":"192.167.1.100","cost":6,"cost_text":"1020 bit/s"},{"source":"192.167.1.100","target":"192.168.1.100","cost":6,"cost_text":"1020 bit/s"},{"source":"192.167.1.100","target":"192.166.1.100","cost":6,"cost_text":"1020 bit/s"},{"source":"192.166.1.100","target":"192.167.1.100","cost":6,"cost_text":"1020 bit/s"},{"source":"192.165.1.100","target":"192.166.1.100","cost":6,"cost_text":"1020 bit/s"},{"source":"192.166.1.100","target":"192.165.1.100","cost":6,"cost_text":"1020 bit/s"},{"source":"192.165.1.100","target":"192.168.1.100","cost":6,"cost_text":"1020 bit/s"},{"source":"192.168.1.100","target":"192.165.1.100","cost":6,"cost_text":"1020 bit/s"}],"router_id":"192.168.1.100","topology_id":"topology_test"}]},{"type":"NetworkCollection","collection":[{"type":"GeoLocation","Originator":"192.178.1.100","Position":{"Latitude":53.1114158424862665697219199500977993011474609375,"Longitude":18.0265903472900390625},"Time":{"Year4Digit":119,"MonthNumeric":3,"Day":2,"HourTime":8,"MinuteTime":5,"SecondTime":44}},{"type":"GeoLocation","Originator":"192.177.1.100","Position":{"Latitude":53.12357303344450798476827912963926792144775390625,"Longitude":18.00693511962890625},"Time":{"Year4Digit":119,"MonthNumeric":3,"Day":2,"HourTime":8,"MinuteTime":5,"SecondTime":44}},{"type":"GeoLocation","Originator":"192.166.1.100","Position":{"Latitude":53.12112641752724329080592724494636058807373046875,"Longitude":17.9791259765625},"Time":{"Year4Digit":119,"MonthNumeric":3,"Day":2,"HourTime":8,"MinuteTime":5,"SecondTime":44}},{"type":"GeoLocation","Originator":"192.175.1.100","Position":{"Latitude":53.11437818671146970928020891733467578887939453125,"Longitude":18.00294399261474609375},"Time":{"Year4Digit":119,"MonthNumeric":3,"Day":2,"HourTime":8,"MinuteTime":5,"SecondTime":44}},{"type":"GeoLocation","Originator":"192.168.1.100","Position":{"Latitude":53.13500589733093448785439250059425830841064453125,"Longitude":17.96329021453857421875},"Time":{"Year4Digit":119,"MonthNumeric":3,"Day":2,"HourTime":8,"MinuteTime":5,"SecondTime":44}},{"type":"GeoLocation","Originator":"192.167.1.100","Position":{"Latitude":53.138224060321334718537400476634502410888671875,"Longitude":17.977237701416015625},"Time":{"Year4Digit":119,"MonthNumeric":3,"Day":2,"HourTime":8,"MinuteTime":5,"SecondTime":44}},{"type":"GeoLocation","Originator":"192.165.1.100","Position":{"Latitude":53.11785546082753484142813249491155147552490234375,"Longitude":17.9357814788818359375},"Time":{"Year4Digit":119,"MonthNumeric":3,"Day":2,"HourTime":8,"MinuteTime":5,"SecondTime":44}},{"type":"GeoLocation","Originator":"192.174.1.100","Position":{"Latitude":53.1217960315141368710101232863962650299072265625,"Longitude":18.08740139007568359375},"Time":{"Year4Digit":119,"MonthNumeric":3,"Day":2,"HourTime":8,"MinuteTime":5,"SecondTime":44}}]}]}');

--
-- PostgreSQL database dump complete
--

