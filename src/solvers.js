/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other

window.findSolution = function(row, n, board, conflictCheck, callback) {
  //if row at last row, this is the solution
  if (row === n) {
    return callback();
  }
  //iterate through each tile checking for solutions
  for ( var i = 0; i < n; i++) {
    board.togglePiece(row, i);
    //if there isn't conflict, keep recursing to find the next best solution
    if (!board[conflictCheck]()) {
      var result = findSolution(row + 1, n, board, conflictCheck, callback);
      //if the result is done, return it
      if (result) {
        return result;
      }
    }
    //toggle off if there is a conflict
    board.togglePiece(row, i);
  }
};

window.findNRooksSolution = function(n) {
  //debugger;
  //initialize new board of size n
  var board = new Board({n: n});
  var boardString = JSON.stringify(board);
  //originally hard coded---> now transition to solution code
  //uses findSolution to recurse through board to check possible solution at each
  //tile with any rook conflicts while using _.map to map out the chessboard without mutating original board (such that we can return said board if no solutions exist)
  var solution = findSolution(0, n, board, 'hasAnyRooksConflicts', function(n) {
    return board.rows();
  });
  solution = solution || JSON.parse(boardString);

  //return solution
  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  //declare new board of size n
  var board = new Board({n: n});
  var solutionCount = 0;
  findSolution(0, n, board, 'hasAnyRooksConflicts', function() {
    solutionCount++;
  });
  //

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  //debugger;
  //initialize board to be copied later on (shallowly)
  var board = new Board({n: n});
  var stringBoard = JSON.stringify(board);
  //originally hard coded---> now transition to solution code
  //uses findSolution to recurse through board to check possible solution at each
  //tile with any rook conflicts while using _.map to map out the chessboard without mutating original board (such that we can return said board if no solutions exist)
  var solution = findSolution(0, n, board, 'hasAnyQueensConflicts', function() {
    return board.rows();
  });
  solution = solution || JSON.parse(stringBoard);
  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  //if no solution, return the original board
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  //initialize counter
  var solutionCount = 0; //fixme
  var board = new Board({n: n});
  //counts for every time there is a solution from findSolution as it will return a solution if found one from findSolution, every time it recursively calls within findSolution, eventually the call stack will return a solution once found,
  //it does this for every starting position
  findSolution(0, n, board, 'hasAnyQueensConflicts', function() {
    solutionCount++;
  });
  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
