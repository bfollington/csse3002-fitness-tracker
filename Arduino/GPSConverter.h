#pragma once

#include <stdint.h>

//Returns degrees x 10,000,000. We get 7 decimal places, or an accuracy of
//roughly 11mm at the equator. The GPS gives us worse, so this shouldn't limit
//our precision.
//floraLat is of the format: 'DDMM.MMMM', floraLon is of the format 'DDDMM.MMMM'.
void dmsToDegrees(const char *floraLat, const char *floraLon, int32_t *lat, int32_t *lon);

