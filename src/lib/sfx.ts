/**
 * Sounds
 * 0 = shoot1
 * 1 = shoot2
 * 2 = shoot3
 * 3 = click
 * 4 = whoosh1
 * 5 = footstep
 * 6 = footstep2
 * 7 = jump
 * 8 = impact
 * 9 = strike
 * 10 = player got shot
 * 11 = player got hit
 * 12 = dash
 * 13 = glass break
 */
export const sfx: Array<Array<number | undefined>> = [
    [, 0, 246, 0.07, , 0, 1, 5, -10, -10, , , 0.05, , , 0.4, 0.05, 0],
    [1.5, 0, 65.40639, 0.06, , 0, 1, 3, -10, -10, , , 0.05, , , 0.7, 0.1, 0, 0.04],
    [1.7, 0, 65.40639, 0.03, , 0.08, 1, 2, -10.5, -10, , , 0.04, , , 0.7, 0.1, 0, 0.09],
    [0.2, 0, 523.2511, 0.02, 0.01, 0.01, 4, 3.3, -4.3, -5.7, 100, , , 1, 8, 0.1, 0.04, 0.2, 0.01, 0.22],
    [, , 65.40639, 0.04, 0.03, 0.07, 1, 1.9, , 6, 2e3, -0.08, 0.28, 7, , , , 0.6, , 0.36, -125],
    [0.1, 0, 344, 0.01, 0.01, 0.06, 4, 0.9, , 1, , , -0.1, 0.8, , -1.6, , 0.6, 0.01, 0.95, 123],
    [0.1, 0, 97.99886, 0.01, 0.01, 0.06, 4, 0.9, , 1, , , -0.1, 0.8, , -1.6, , 0.6, 0.01, 0.95, 123],
    [0.7, 0, 65.40639, 0.02, 0.04, 0.05, , 2.3, -2, , , , , 3.7, , , 0.07, 0.57, 0.02],
    [0.2, 0, 65.40639, 0.02, , 0.06, 4, 1.6, 0.5, 0.5, , , -0.1, 0.8, , -1.6, , 0.6, 0.02, 0.95, 123],
    [0.2, 0, 65.40639, 0.02, 0.03, 0.06, 4, 0.9, , 1, , , -0.1, 0.4, , -1.4, , 0.6, 0.04, 0.95, 123],
    [0.4, 0, 65.40639, 0.01, , 0, 3, 2, , , , , , 9.5, -97, , , 0, 0.04],
    [, 0, 65.40639, 0.03, , 0, 3, 2, , , , , , 9.5, -97, , , 0, 0.04],
    [0.7, 0, 65.40639, 0.01, 0.02, 0.05, , 2.3, -0.8, , 50, , , 3.7, 2, , 0.04, 0.57, 0.01],
    [0.5, , 523.2511, 0.03, 0.04, 0.09, 4, 13, , 19, , , , 0.1, 44, 0.2, , 0.3, 0.06, 0.05],
]
