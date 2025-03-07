declare module 'filereader' {
  class FileReader {
    readAsArrayBuffer(blob: Blob): void;
    readAsDataURL(blob: Blob): void;
    readAsText(blob: Blob, encoding?: string): void;
    abort(): void;
    readonly EMPTY: number;
    readonly LOADING: number;
    readonly DONE: number;
    readonly error: Error | null;
    readonly result: string | ArrayBuffer | null;
    readonly readyState: number;
    onload: ((this: FileReader, ev: any) => any) | null;
    onerror: ((this: FileReader, ev: any) => any) | null;
    onloadstart: ((this: FileReader, ev: any) => any) | null;
    onloadend: ((this: FileReader, ev: any) => any) | null;
    onprogress: ((this: FileReader, ev: any) => any) | null;
    onabort: ((this: FileReader, ev: any) => any) | null;
  }
  export = FileReader;
} 