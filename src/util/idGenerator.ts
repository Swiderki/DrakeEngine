export default class IdGenerator {
  private static _id: number = 1;

  static new(): number {
    console.log("aa", IdGenerator._id);
    return IdGenerator._id++;
  }
}
