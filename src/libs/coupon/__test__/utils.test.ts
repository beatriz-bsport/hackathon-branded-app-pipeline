import 'regenerator-runtime/runtime';
import { JSDOM } from 'jsdom';
import {
  extractVoucherCodesFromCSVString,
  parseCSVFileToGetVoucherCodes,
} from '../utils';
import {
  UNIQUE_CODE_PER_USAGE_COUPON_UPLOAD_FILE_TOO_LARGE_ERROR,
  UNIQUE_CODE_PER_USAGE_COUPON_UPLOAD_NOT_CSV_FILE_ERROR,
  UNIQUE_CODE_PER_USAGE_COUPON_UPLOAD_INCORRECT_DATA_ERROR,
  VOUCHER_CODE_CSV_FILE_MIME_TYPE,
} from '../constants';

const stringWithoutComa = `
12345
74856
78596
45697
78981
98915
87sd4
7z54s
8dsfs
s544s
4s58s
5z7e2
`;

const stringWithComa = `
12345,
74856,
78596,
45697,
78981,
98915,
87sd4,
7z54s,
8dsfs,
s544s,
4s58s,
5z7e2,
`;

const stringWithWhiteSpaces = `
12345


74856
78596

45697
78981



98915
87sd4
7z54s

8dsfs

s544s
4s58s


5z7e2
`;

const stringWithTooLongCode = `
1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
74856
78596
45697
78981
98915
87sd4
7z54s
8dsfs
s544s
4s58s
5z7e2
`;

const expectedResult = [
  '12345',
  '74856',
  '78596',
  '45697',
  '78981',
  '98915',
  '87sd4',
  '7z54s',
  '8dsfs',
  's544s',
  '4s58s',
  '5z7e2',
];

class MockFile {
  fileParts: BlobPart[];

  fileName: string;

  options: FilePropertyBag;

  name: string;

  _size: number;

  type: string;

  constructor(
    fileParts: BlobPart[],
    fileName: string,
    options: FilePropertyBag,
  ) {
    this.fileParts = fileParts;
    this.fileName = fileName || 'mock.csv';
    this.options = options;
    this._size = fileParts.join('').length;
    this.type = options && options.type;
  }

  // Mock implementation of the text() function
  async text() {
    const text = this.fileParts.join('');
    return text;
  }

  get size() {
    return this._size;
  }

  set size(value) {
    if (typeof value !== 'number') {
      throw new Error('Size must be a number.');
    }
    this._size = value;
  }
}

// Set up the JSDOM environment
const dom = new JSDOM();
// @ts-ignore
global.File = MockFile;
// @ts-ignore
global.window = dom.window;
global.document = dom.window.document;

describe('TEST extractVoucherCodesFromCSVString', () => {
  it('Returns the expectedResult if the input is a string without coma', () => {
    expect(extractVoucherCodesFromCSVString(stringWithoutComa)).toEqual(
      expectedResult,
    );
  });

  it('Returns an incorrect data error if the input is a string with coma', () => {
    expect(() => {
      extractVoucherCodesFromCSVString(stringWithComa);
    }).toThrowError(UNIQUE_CODE_PER_USAGE_COUPON_UPLOAD_INCORRECT_DATA_ERROR);
  });

  it('Returns an incorrect data error if the input is a string with a too long code (more than a 100 characters)', () => {
    expect(() => {
      extractVoucherCodesFromCSVString(stringWithTooLongCode);
    }).toThrowError(UNIQUE_CODE_PER_USAGE_COUPON_UPLOAD_INCORRECT_DATA_ERROR);
  });

  it('Returns the expectedResult if the input is a string with white spaces', () => {
    expect(extractVoucherCodesFromCSVString(stringWithWhiteSpaces)).toEqual(
      expectedResult,
    );
  });
});

describe('TEST parseCSVFileToGetVoucherCodes', () => {
  it('Returns the expectedResult if the csv file is a valid one', async () => {
    const mockFile = new File([stringWithoutComa], 'test.csv', {
      type: VOUCHER_CODE_CSV_FILE_MIME_TYPE,
    });
    const codesAsArray = await parseCSVFileToGetVoucherCodes(mockFile);
    expect(codesAsArray).toEqual(expectedResult);
  });

  it('Returns an incorrect data error if the file content is a string with coma', async () => {
    const mockFile = new File([stringWithComa], 'test.csv', {
      type: VOUCHER_CODE_CSV_FILE_MIME_TYPE,
    });
    await expect(parseCSVFileToGetVoucherCodes(mockFile)).rejects.toThrowError(
      UNIQUE_CODE_PER_USAGE_COUPON_UPLOAD_INCORRECT_DATA_ERROR,
    );
  });

  it('Returns a incorrect file type error the file is not a csv', async () => {
    const mockFile = new File([stringWithComa], 'test.csv', {
      type: 'image/jpeg',
    });
    await expect(parseCSVFileToGetVoucherCodes(mockFile)).rejects.toThrowError(
      UNIQUE_CODE_PER_USAGE_COUPON_UPLOAD_NOT_CSV_FILE_ERROR,
    );
  });

  it('Returns a file too large error if the file size > 1000000 (1Mo)', async () => {
    const customSize = 1500000; // Custom size for testing
    const mockFile = new File([stringWithoutComa], 'test.csv', {
      type: VOUCHER_CODE_CSV_FILE_MIME_TYPE,
    });
    Object.defineProperty(mockFile, 'size', {
      value: customSize,
      writable: false,
      enumerable: true,
      configurable: true,
    });
    await expect(parseCSVFileToGetVoucherCodes(mockFile)).rejects.toThrowError(
      UNIQUE_CODE_PER_USAGE_COUPON_UPLOAD_FILE_TOO_LARGE_ERROR,
    );
  });
});
