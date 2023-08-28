SELECT
rd.status, 
rd.id, 
u.name AS requested_by,
(SELECT ST_Distance(rd.pickup_location, rd.destination_location)) AS distance_meters
FROM ride_requests rd
JOIN users u ON rd.user_id = u.id
WHERE ST_DWithin(rd.pickup_location, (SELECT current_location FROM drivers WHERE user_id = $1), $2)
AND rd.status = 'pending' AND rd.user_id != $1;

