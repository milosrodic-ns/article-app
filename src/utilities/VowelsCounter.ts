export class VowelsCounter {
  private words: { [key: string]: string } = {};
  private vowelLengths = new Set<number>();

  constructor(private readonly title: string) {}

  public getMostVowels(): string {
    this.parseTitle();
    const highestN = Math.max(...this.vowelLengths.values());
    return this.words[`i${highestN}`];
  }

  private parseTitle(): void {
    this.title.split(" ").forEach((word) => {
      const result = this.countVowels(word);
      this.vowelLengths.add(result);

      if (this.words[`i${result}`]) {
        if (word.length > this.words[`i${result}`].length) {
          this.words[`i${result}`] = word;
        }
      } else {
        this.words[`i${result}`] = word;
      }
    });
  }

  private countVowels(str: string) {
    const counted = str.match(/[aeiouy]/gi);
    return counted === null ? 0 : counted.length;
  }
}
