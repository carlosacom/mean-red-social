export class Message {
  constructor(
    public _id: string,
    public text: string,
    public viewed: boolean,
    public emitter: string,
    public receiver: string,
    public created_at: string
  ) { }
}
