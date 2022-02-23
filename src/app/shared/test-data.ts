import { NodesData } from 'rete/types/core/data';

export const testData: { [key: string]: NodesData } = {
  NAND: <NodesData>{
    '1': {
      id: 1,
      data: {
        id: 'w7Fb',
        'Source-w7Fb': true,
      },
      inputs: {},
      outputs: {
        data_output: {
          connections: [
            {
              node: 4,
              input: 'data_input_1',
              data: {},
            },
          ],
        },
      },
      position: [58.451239986979346, 194.8746555591724],
      name: 'Source',
    },
    '2': {
      id: 2,
      data: {
        id: 'N4Ek',
        'Source-N4Ek': true,
      },
      inputs: {},
      outputs: {
        data_output: {
          connections: [
            {
              node: 4,
              input: 'data_input_0',
              data: {},
            },
          ],
        },
      },
      position: [54.5, 107],
      name: 'Source',
    },
    '3': {
      id: 3,
      data: {
        id: 'AR_P',
        'Sink-AR_P': false,
      },
      inputs: {
        data_input_0: {
          connections: [
            {
              node: 5,
              output: 'data_output',
              data: {},
            },
          ],
        },
      },
      outputs: {},
      position: [530.7520575694474, 156.94711940277364],
      name: 'Sink',
    },
    '4': {
      id: 4,
      data: {
        id: 'QCox',
        'And-QCox': false,
      },
      inputs: {
        data_input_0: {
          connections: [
            {
              node: 2,
              output: 'data_output',
              data: {},
            },
          ],
        },
        data_input_1: {
          connections: [
            {
              node: 1,
              output: 'data_output',
              data: {},
            },
          ],
        },
      },
      outputs: {
        data_output: {
          connections: [
            {
              node: 5,
              input: 'data_input_0',
              data: {},
            },
          ],
        },
      },
      position: [172.3231300775974, 143.62121602021503],
      name: 'And',
    },
    '5': {
      id: 5,
      data: {
        id: 'dpLv',
        'Not-dpLv': false,
      },
      inputs: {
        data_input_0: {
          connections: [
            {
              node: 4,
              output: 'data_output',
              data: {},
            },
          ],
        },
      },
      outputs: {
        data_output: {
          connections: [
            {
              node: 3,
              input: 'data_input_0',
              data: {},
            },
          ],
        },
      },
      position: [331.76872936613927, 128.85234031435067],
      name: 'Not',
    },
  },
  AND_CUSTOM: <NodesData>{
    '1': {
      id: 1,
      data: {
        id: 'xHmU',
        'Source-xHmU': true,
      },
      inputs: {},
      outputs: {
        data_output: {
          connections: [
            {
              node: 5,
              input: 'Source-w7Fb',
              data: {},
            },
          ],
        },
      },
      position: [40, 200],
      name: 'Source',
    },
    '2': {
      id: 2,
      data: {
        id: '-9iB',
        'Source--9iB': true,
      },
      inputs: {},
      outputs: {
        data_output: {
          connections: [
            {
              node: 5,
              input: 'Source-N4Ek',
              data: {},
            },
          ],
        },
      },
      position: [38, 280],
      name: 'Source',
    },
    '3': {
      id: 3,
      data: {
        id: 'mPVj',
        'Sink-mPVj': true,
      },
      inputs: {
        data_input_0: {
          connections: [
            {
              node: 4,
              output: 'data_output',
              data: {},
            },
          ],
        },
      },
      outputs: {},
      position: [556.5, 217.5],
      name: 'Sink',
    },
    '4': {
      id: 4,
      data: {
        id: '-sms',
        'Not--sms': true,
      },
      inputs: {
        data_input_0: {
          connections: [
            {
              node: 5,
              output: 'Sink-AR_P',
              data: {},
            },
          ],
        },
      },
      outputs: {
        data_output: {
          connections: [
            {
              node: 3,
              input: 'data_input_0',
              data: {},
            },
          ],
        },
      },
      position: [345.5, 190.5],
      name: 'Not',
    },
    '5': {
      id: 5,
      data: {
        circuitName: 'NAND',
      },
      inputs: {
        'Source-w7Fb': {
          connections: [
            {
              node: 1,
              output: 'data_output',
              data: {},
            },
          ],
        },
        'Source-N4Ek': {
          connections: [
            {
              node: 2,
              output: 'data_output',
              data: {},
            },
          ],
        },
      },
      outputs: {
        'Sink-AR_P': {
          connections: [
            {
              node: 4,
              input: 'data_input_0',
              data: {},
            },
          ],
        },
      },
      position: [131, 189],
      name: 'Custom',
    },
  },
};
