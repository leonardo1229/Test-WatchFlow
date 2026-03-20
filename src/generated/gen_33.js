/**
 * gen_33.js — Generated: Command pattern
 */

class CommandHistory {
  constructor() {
    this._done   = [];
    this._undone = [];
  }

  execute(command) {
    if (typeof command.execute !== 'function') throw new TypeError('command must have execute()');
    command.execute();
    this._done.push(command);
    this._undone = [];
    return this;
  }

  undo() {
    const command = this._done.pop();
    if (!command) return false;
    if (typeof command.undo !== 'function') throw new TypeError('command does not support undo()');
    command.undo();
    this._undone.push(command);
    return true;
  }

  redo() {
    const command = this._undone.pop();
    if (!command) return false;
    command.execute();
    this._done.push(command);
    return true;
  }

  canUndo() { return this._done.length > 0; }
  canRedo() { return this._undone.length > 0; }
  clear()   { this._done = []; this._undone = []; }
}

function createCommand(executeFn, undoFn) {
  return { execute: executeFn, undo: undoFn };
}

module.exports = { CommandHistory, createCommand };
