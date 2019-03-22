CREATE TABLE IF NOT EXISTS public.net_json_graph (
  -- Interatively store the network graph we fetch
  -- from a tactical router. Could provide useful for
  -- historic purposes
  net_json_graph_id SERIAL PRIMARY KEY NOT NULL,
  -- we might not even need a key here
  content JSONB NOT NULL,
  created TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS public.device(
  device_id SERIAL PRIMARY KEY NOT NULL
  -- what does a device consist of?
);

CREATE TABLE IF NOT EXISTS public.adaption (
  adaption_id SERIAL PRIMARY KEY NOT NULL,
  -- what does an adaption consist of?

  -- create dummy columns
  adaption1 INTEGER NOT NULL,
  adaption2 INTEGER NOT NULL,
  adaption3 INTEGER NOT NULL,
  adaption4 INTEGER NOT NULL,
  adaption5 INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS public.system_log (
  -- The system log exists solely provide traceability
  -- for adaptions made in the system
  system_log_id SERIAL PRIMARY KEY NOT NULL,
  device_id INTEGER NOT NULL REFERENCES device(device_id),
  adaption_id INTEGER REFERENCES adaption(adaption_id),
  description TEXT NOT NULL,
  created TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.position_log (
  -- We should really consider implementing PostGIS
  -- as well. PostGIS allow for interesting things,
  -- like querying which devices are within a polygon
  -- of points for instance. This can be added later though
  -- and we can backfill a point based on lat lng.
  device_id INTEGER NOT NULL REFERENCES device(device_id),
  lat FLOAT NOT NULL,
  lng FLOAT NOT NULL,
  created TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
