export const BALL_RADIUS = 8;
export const BALL_SPEED = 4;
export const BALL_START_ANGLE = Math.PI / 6;
export const MAX_BOUNCE_ANGLE = Math.PI / 3;

export const PADDLE_WIDTH = 100;
export const PADDLE_HEIGHT = 10;
export const PADDLE_SPEED = 6;
export const PADDLE_BOTTOM_OFFSET = 30;

export const BLOCK_WIDTH = 48;
export const BLOCK_HEIGHT = 16;
export const BLOCK_GAP = 6;
export const BLOCK_TOP = 30;
export const BLOCK_LEFT = 27;
export const BLOCK_COLUMNS = 8;
export const BLOCK_ROWS = 6;
export const NORMAL_BLOCK_SCORE = 10;
export const HARD_BLOCK_SCORE = 30;

// 0: empty, 1: normal, 2: hard, 3: unbreakable
export const BOARD_PATTERNS: readonly (readonly string[])[] = [
  // Chain pocket: enter through the lower gate and let the ball ricochet inside.
  ["00333300", "03111130", "03122130", "03111130", "03300330", "00000000"],
  // Shooting gallery: separated targets and narrow lanes reward careful aiming.
  ["00000000", "30303030", "01020102", "33303330", "00102010", "33033033"],
  // Bank shot: alternating ramps send the ball through a zigzag route.
  ["00000000", "22200000", "03320000", "00033200", "00003320", "00000323"],
  // Pinball: hard bumpers redirect shots around the central target.
  ["03000030", "13122131", "30111103", "33122133", "30111103", "03000030"],
  // Fortress: break through the central gate, then clear the guarded chamber.
  ["33333333", "31111113", "31222113", "31111113", "33300333", "00000000"],
  // Switchback: offset walls require repeated side-to-side bank shots.
  ["00000000", "22222220", "00000030", "02222220", "03000000", "02222223"],
  // Bullseye: work inward through rings of hard blocks and obstacles.
  ["00333300", "03122130", "31211213", "31211213", "03122130", "00311300"],
  // Split lanes: choose a side, pass its gate, and line up the targets.
  ["00000000", "33033033", "01020102", "01030301", "33303330", "00102010"],
  // Precision corridor: staggered bumpers leave slim routes to the targets.
  ["30303030", "01020102", "33303330", "02010201", "33033033", "01020102"],
  // Chaos chamber: a dense target field with scattered redirecting bumpers.
  ["12121212", "13131313", "11111111", "31313131", "12121212", "00322300"],
  // Classic rectangle: a straightforward, satisfying wall of targets.
  ["11111111", "11111111", "11111111", "11111111", "11111111", "11111111"],
  // Pyramid: simple, centered, and easy to read.
  ["00011000", "00111100", "01111110", "11111111", "11111111", "11111111"],
  // Stripes: clear the alternating rows.
  ["11111111", "00000000", "11111111", "00000000", "11111111", "00000000"],
  // Small diamond: a clean shape with plenty of open space.
  ["00011000", "00111100", "01111110", "00111100", "00011000", "00000000"],
  // Steps: a simple staircase across the board.
  ["10000000", "11000000", "11100000", "11110000", "11111000", "11111100"],
  // Checkerboard: consistent gaps make every target visible.
  ["10101010", "01010101", "10101010", "01010101", "10101010", "01010101"],
  // Hard cap: a solid line of hard blocks above ordinary targets.
  ["22222222", "11111111", "11111111", "11111111", "00000000", "00000000"],
  // Center stack: focus on the compact cluster in the middle.
  ["00011000", "00111100", "00111100", "01111110", "00111100", "00011000"],
  // Two towers: two easy-to-understand columns with a clear lane between.
  ["11000011", "11000011", "11000011", "11000011", "11000011", "11000011"],
  // Simple mixed board: mostly normal blocks with a few hard targets.
  ["11111111", "11111111", "11222111", "11111111", "11111111", "11111111"],
  // Maze 1: enter at the left, cross the lower lane, then turn right.
  ["33333333", "30000003", "31111103", "30000003", "30333333", "30333333"],
  // Maze 2: a right-side entrance leads through two narrow switchbacks.
  ["33333333", "30000003", "30221103", "30000003", "33333303", "33333303"],
  // Maze 3: a centered entry winds left, then returns to the right.
  ["33333333", "30000003", "31111103", "33333303", "30000003", "33303333"],
  // Maze 4: a long left-right-left route with hard targets at the turns.
  ["33333333", "30000003", "30111113", "30000003", "33303333", "33303333"],
  // Maze 5: a narrow entrance opens into a chamber and a second corridor.
  ["33333333", "30000003", "31111103", "33333303", "30000003", "30333333"],
  // Maze 6: alternate gates force a full-width zigzag.
  ["33333333", "30000003", "30111103", "30000003", "33333303", "33333303"],
  // Maze 7: hard targets guard the bends in a long winding passage.
  ["33333333", "30000003", "31221103", "33333303", "30000003", "33303333"],
  // Maze 8: a lower loop leads to a narrow upper target chamber.
  ["33333333", "30000003", "31112103", "30000003", "30333333", "30333333"],
  // Maze 9: enter from the right and weave through alternating lanes.
  ["33333333", "30000003", "31111103", "33333303", "30000003", "33333303"],
  // Maze 10: a long final switchback with targets along both corridors.
  ["33333333", "30000003", "31122103", "30000003", "33333303", "33333303"],
];
