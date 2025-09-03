export class User {
  private readonly id: string;
  private readonly name: string;

  constructor(id: string, name: string) {
    if (!id) {
      throw new Error('Id is required');
    }
    if (!name) {
      throw new Error('Name is required');
    }

    this.id = id;
    this.name = name;
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }
}