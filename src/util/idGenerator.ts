export default class IDGenerator {
  private static _id: number = 1;

  static new(): number {
    return IDGenerator._id++;
  }
}
