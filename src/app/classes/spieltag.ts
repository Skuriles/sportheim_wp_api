import { DateTime } from "luxon";

export class Spieltag {
  public id: number;
  public date: DateTime;
  public datum: string;
  public mannschaft: string;
  public heim: string;
  public gast: string;
  public person: string;

  public createFrom(element: Spieltag) {
    this.id = element.id;
    this.datum = element.datum;
    this.date = DateTime.fromSQL(element.datum).toLocal();
    this.mannschaft = element.mannschaft;
    this.heim = element.person;
    this.gast = element.gast;
    this.person = element.person;
  }
}
