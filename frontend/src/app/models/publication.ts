export class Publication {
  constructor(
    public _id: string,
    public text: string,
    public user: string,
    public created_at: string,
    public file?: string,
  ) { }

}
