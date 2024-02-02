// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      //declare variable to keep track of conflicts at row: rowIndex
      var numConflict = 0;
      //declare variable for row we want to look at
      var row = this.get(rowIndex);
      //iterate to check how many conflicts there are
      for (var i = 0; i < row.length; i++) {
        if (row[i] === 1) {
          numConflict++;
        }
      }
      //if exceeds 2 or more, there's a conflict, return true
      if (numConflict >= 2) {
        return true;
      }
      return false;
    },

    // test if any rows on this board contain conflicts

    hasAnyRowConflicts: function() {
      //debugger;
      //iterates through each row checking for conflicts
      for (var i = 0; i < this.rows().length; i++) {
        if (this.hasRowConflictAt(i) === true) {
          return true;
        }
      }
      return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      //debugger;
      //declare variable to count conflicts
      var conflict = 0;
      //declare rows variable to reference board
      var rows = this.rows();
      //iterate through each row and a certain col index to check if there
      //are conflicts
      for ( var i = 0; i < rows.length; i++) {
        if (rows[i][colIndex] === 1) {
          conflict++;
        }
      }
      //return true if 2 or more conflicts
      if (conflict >= 2) {
        return true;
      }
      return false; // fixme
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      //debugger;
      //iterates through each column checking for a conflict
      var rows = this.rows();
      for (var i = 0; i < rows.length; i++) {
        if (this.hasColConflictAt(i)) {
          return true;
        }
      }
      return false; // fixme
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      //declare counter to count number of conflicts

      var numConflict = 0;
      //variable to store column index start point
      var firstCol = majorDiagonalColumnIndexAtFirstRow;
      //declare variable when we need to switch rows
      var switchRow;
      //declare variable to reference the board
      var rows = this.rows();
      //this account for when column index is 0, where going from top left top bottom right means also check the beginning column with rows below as start points as well
      if (firstCol === 0) {
        for (var i = 1; i < rows.length; i++) {
          switchRow = i;
          for (j = firstCol; j < rows.length - 1; j++) {
            if (rows[switchRow][j] === 1) {
              numConflict++;
            }
            switchRow++;
            if (switchRow > rows.length - 1) {
              break;
            }
          }
          if (numConflict >= 2) {
            return true;
          } else {
            numConflict = 0;
          }
        }
        //iterates through each major diagonal, checking for conflicts
      }
      for (var i = 0; i < rows.length; i++) {
        //board.rows()[i][firstCol] = 'x';
        if (rows[i][firstCol] === 1) {
          numConflict++;
        }
        firstCol++;
        //if the column hits the last column, end iteration
        if (firstCol === rows.length) {
          break;
        }
      }
      //returns true if exceeds 2 or more
      if (numConflict >= 2) {
        return true;
      }
      return false; // fixme
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      //debugger;

      //iterates through each major diagonal checking for conflicts
      var rows = this.rows();
      for (var i = 0; i < rows.length; i++) {
        if (this.hasMajorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false; // fixme
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      //declare variable to track number of conflicts
      var numConflict = 0;
      //declare variable to store first minor colun index start point
      var firstCol = minorDiagonalColumnIndexAtFirstRow;
      //declare variable for switching columns
      var switchCol = firstCol;
      //declare variable for switching rows
      var switchRow;
      var rows = this.rows();
      //accounts for last Col rows besides the main first diagonal (rows below for last column)
      if (switchCol === rows.length - 1) {
        for (var i = 1; i < rows.length; i++) {
          switchRow = i;
          for (var j = rows.length - 1; j >= i; j--) {
            if (rows[switchRow][j] === 1) {
              numConflict++;
            }
            switchRow++;
            if (switchRow > rows.length - 1) {
              break;
            }
          }
          if (numConflict >= 2) {
            return true;
          } else {
            numConflict = 0;
          }

        }

      }//start iterating from top right to bottom left
      switchCol = firstCol;
      for (var i = 0; i < rows.length; i++) {
        if (rows[i][switchCol] === 1) {
          numConflict++;
        }

        switchCol--;
        //check if we've hit the end of the chessboard
        if (switchCol < 0) {
          break;
        }
      }
      if (numConflict >= 2) {
        return true;
      }
      return false; // fixme
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {

      //debugger;
      //var board = new Board({n: this.rows().length});
      var rows = this.rows();
      //iterate through each column with the column index passed
      //into hasMinorDiagonalConflictAt, checkings for conflicts at each minor diagonal
      for (var i = rows.length - 1; i >= 0; i--) {
        if (this.hasMinorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false; // fixme
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
