# osm-dati-ipla

query overpass:

```
relation["ref:REI"]["ref:REI" ~ "^ECN"]
  ({{bbox}});
out geom;
```

esporta come geojson poi salva come:

export_OSM.geojson

Richiede dati IPLA, contatta IPLA per avere il file.


