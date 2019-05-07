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
2	param_update	Human updated parameters	1
3	switch prot	change protocol	2
4	advPeriod	update value	3
5	brokerTcpPort	update value	4
6	brokerURL	update value	5
7	checkingPeriod	update value	6
8	forwarderTimeout	update value	7
9	gwId	update value	7
10	handlerTimeout	update value	7
11	keepAlivePeriod	update value	7
12	maxMqttsLength	update value	7
13	maxRetries	update value	7
14	predfTopicIdSize	update value	7
15	protocolVersion	update value	7
16	udpPort	update value	7
17	waitingTime	update value	7
18	willQoS	update value	7
19	brokerURL	update value	7
20	cleanSession	update value	7
21	clientInterfaces	update value	7
22	predefinedTopicsFile	update value	7
23	protocolName	update value	7
24	retain	update value	7
25	serialPortURL	update value	7
26	willFlag	update value	7
27	willMessage	update value	7
28	willTopic	update value	7
29	minMqttsLength	update value	7
\.


--
-- Data for Name: net_json_graph; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.net_json_graph (net_json_graph_id, content, created) FROM stdin;
\.


--
-- Data for Name: network_collection; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.network_collection (collection_id, collection, created) FROM stdin;
1	{"type": "NetworkCollection", "collection": [{"type": "NetworkCollection", "collection": [{"type": "NetworkGraph", "label": "RuDi Network-7", "links": [{"cost": 6, "source": "192.178.1.100", "target": "192.177.1.100", "cost_text": "1020 bit/s", "properties": {}}, {"cost": 6, "source": "192.177.1.100", "target": "192.178.1.100", "cost_text": "1020 bit/s", "properties": {}}, {"cost": 6, "source": "192.177.1.100", "target": "192.166.1.100", "cost_text": "1020 bit/s", "properties": {}}, {"cost": 6, "source": "192.166.1.100", "target": "192.177.1.100", "cost_text": "1020 bit/s", "properties": {}}, {"cost": 6, "source": "192.175.1.100", "target": "192.166.1.100", "cost_text": "1020 bit/s"}, {"cost": 6, "source": "192.166.1.100", "target": "192.175.1.100", "cost_text": "1020 bit/s", "properties": {}}, {"cost": 6, "source": "192.175.1.100", "target": "192.178.1.100", "cost_text": "1020 bit/s", "properties": {}}, {"cost": 6, "source": "192.178.1.100", "target": "192.175.1.100", "cost_text": "1020 bit/s", "properties": {}}], "nodes": [{"id": "192.178.1.100", "label": "NODE-7A"}, {"id": "192.177.1.100", "label": "NODE-7B"}, {"id": "192.166.1.100", "label": "NODE-C"}, {"id": "192.175.1.100", "label": "NODE-7D"}], "metric": "rudi", "version": "1.0.7", "protocol": "olsrv2", "revision": "rudi7", "router_id": "192.178.1.100", "topology_id": "topology_rudi"}, {"type": "NetworkGraph", "label": "RuDi simulated Network", "links": [{"cost": 6, "source": "192.168.1.100", "target": "192.167.1.100", "cost_text": "1020 bit/s"}, {"cost": 6, "source": "192.167.1.100", "target": "192.168.1.100", "cost_text": "1020 bit/s"}, {"cost": 6, "source": "192.167.1.100", "target": "192.166.1.100", "cost_text": "1020 bit/s"}, {"cost": 6, "source": "192.166.1.100", "target": "192.167.1.100", "cost_text": "1020 bit/s"}, {"cost": 6, "source": "192.165.1.100", "target": "192.166.1.100", "cost_text": "1020 bit/s"}, {"cost": 6, "source": "192.166.1.100", "target": "192.165.1.100", "cost_text": "1020 bit/s"}, {"cost": 6, "source": "192.165.1.100", "target": "192.168.1.100", "cost_text": "1020 bit/s"}, {"cost": 6, "source": "192.168.1.100", "target": "192.165.1.100", "cost_text": "1020 bit/s"}], "nodes": [{"id": "192.168.1.100", "label": "NODE-A"}, {"id": "192.167.1.100", "label": "NODE-B"}, {"id": "192.166.1.100", "label": "NODE-C"}, {"id": "192.165.1.100", "label": "NODE-D"}], "metric": "rudi", "version": "1.0.1", "protocol": "olsrv2", "revision": "rudi2080212", "router_id": "192.168.1.100", "topology_id": "topology_test"}]}, {"type": "NetworkCollection", "collection": [{"Time": {"Day": 2, "HourTime": 8, "MinuteTime": 5, "SecondTime": 44, "Year4Digit": 119, "MonthNumeric": 3}, "type": "GeoLocation", "Position": {"Latitude": 53.1114158424862665697219199500977993011474609375, "Longitude": 18.0265903472900390625}, "Originator": "192.178.1.100"}, {"Time": {"Day": 2, "HourTime": 8, "MinuteTime": 5, "SecondTime": 44, "Year4Digit": 119, "MonthNumeric": 3}, "type": "GeoLocation", "Position": {"Latitude": 53.12357303344450798476827912963926792144775390625, "Longitude": 18.00693511962890625}, "Originator": "192.177.1.100"}, {"Time": {"Day": 2, "HourTime": 8, "MinuteTime": 5, "SecondTime": 44, "Year4Digit": 119, "MonthNumeric": 3}, "type": "GeoLocation", "Position": {"Latitude": 53.12112641752724329080592724494636058807373046875, "Longitude": 17.9791259765625}, "Originator": "192.166.1.100"}, {"Time": {"Day": 2, "HourTime": 8, "MinuteTime": 5, "SecondTime": 44, "Year4Digit": 119, "MonthNumeric": 3}, "type": "GeoLocation", "Position": {"Latitude": 53.11437818671146970928020891733467578887939453125, "Longitude": 18.00294399261474609375}, "Originator": "192.175.1.100"}, {"Time": {"Day": 2, "HourTime": 8, "MinuteTime": 5, "SecondTime": 44, "Year4Digit": 119, "MonthNumeric": 3}, "type": "GeoLocation", "Position": {"Latitude": 53.13500589733093448785439250059425830841064453125, "Longitude": 17.96329021453857421875}, "Originator": "192.168.1.100"}, {"Time": {"Day": 2, "HourTime": 8, "MinuteTime": 5, "SecondTime": 44, "Year4Digit": 119, "MonthNumeric": 3}, "type": "GeoLocation", "Position": {"Latitude": 53.138224060321334718537400476634502410888671875, "Longitude": 17.977237701416015625}, "Originator": "192.167.1.100"}, {"Time": {"Day": 2, "HourTime": 8, "MinuteTime": 5, "SecondTime": 44, "Year4Digit": 119, "MonthNumeric": 3}, "type": "GeoLocation", "Position": {"Latitude": 53.11785546082753484142813249491155147552490234375, "Longitude": 17.9357814788818359375}, "Originator": "192.165.1.100"}, {"Time": {"Day": 2, "HourTime": 8, "MinuteTime": 5, "SecondTime": 44, "Year4Digit": 119, "MonthNumeric": 3}, "type": "GeoLocation", "Position": {"Latitude": 53.1217960315141368710101232863962650299072265625, "Longitude": 18.08740139007568359375}, "Originator": "192.174.1.100"}]}]}	2019-05-07 05:07:31.31862+00
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
7	2	3	done	2019-05-07 05:41:24.386817+00
8	2	4	done	2019-05-07 05:41:37.239556+00
9	2	5	done	2019-05-07 05:41:40.792198+00
10	2	6	done	2019-05-07 05:41:53.948331+00
11	2	7	done	2019-05-07 05:44:05.325588+00
12	2	8	done	2019-05-07 05:44:05.328172+00
13	2	9	done	2019-05-07 05:44:05.330104+00
14	2	10	done	2019-05-07 05:44:05.332207+00
15	2	11	done	2019-05-07 05:44:05.334705+00
16	2	12	done	2019-05-07 05:44:05.336701+00
17	2	13	done	2019-05-07 05:44:05.338877+00
18	2	14	done	2019-05-07 05:44:05.340726+00
19	2	15	done	2019-05-07 05:44:05.348108+00
20	2	16	done	2019-05-07 05:44:05.355658+00
21	2	17	done	2019-05-07 05:44:05.363105+00
22	2	18	done	2019-05-07 05:44:05.371172+00
23	2	19	done	2019-05-07 05:44:05.373484+00
24	2	20	done	2019-05-07 05:44:05.374633+00
25	2	21	done	2019-05-07 05:44:05.377087+00
26	2	22	done	2019-05-07 05:44:05.379308+00
27	2	23	done	2019-05-07 05:44:05.38124+00
28	2	24	done	2019-05-07 05:44:05.383915+00
29	2	25	done	2019-05-07 05:44:05.386018+00
30	2	26	done	2019-05-07 05:44:05.387959+00
\.


--
-- Name: adaption_adaption_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.adaption_adaption_id_seq', 29, false);


--
-- Name: config_config_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.config_config_id_seq', 7, true);


--
-- Name: device_device_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.device_device_id_seq', 3, false);


--
-- Name: net_json_graph_net_json_graph_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.net_json_graph_net_json_graph_id_seq', 1, false);


--
-- Name: network_collection_collection_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.network_collection_collection_id_seq', 1, true);


--
-- Name: system_log_system_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.system_log_system_log_id_seq', 30, true);


--
-- PostgreSQL database dump complete
--

