export class Command {
  undo() {
    throw new Error('Undo method should be implemented');
  }
  execute() {
    throw new Error('Execute method should be implemented');
  }
}
