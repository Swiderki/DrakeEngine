export default class IdGenerator {
  private _id: number = 1;

  get id(): number {
    return this._id++;
  }
}
