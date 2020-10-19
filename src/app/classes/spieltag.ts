export class Spieltag {
  public id: number;
  public tag: string;
  public datum: string;
  public uhrzeit: string;
  public mannschaft: string;
  public heim: string;
  public gast: string;
  public person: string;

  public createFrom(element: Spieltag) {
    this.tag = element.tag;
    this.datum = element.datum;
    this.uhrzeit = element.uhrzeit;
    this.mannschaft = element.mannschaft;
    this.heim = element.person;
    this.gast = element.gast;
    this.person = element.person;
  }
}
