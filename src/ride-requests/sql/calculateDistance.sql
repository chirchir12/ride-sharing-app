SELECT ST_DistanceSphere(
    ST_SetSRID(ST_MakePoint($1, $2), 4326),
    ST_SetSRID(ST_MakePoint($3, $4), 4326)
) AS distance_meters