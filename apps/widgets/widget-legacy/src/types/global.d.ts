//added module declaration to prevent typescript error on dynamic css file import

declare module '*.css' {
    const value: any;
    export = value;
  }
