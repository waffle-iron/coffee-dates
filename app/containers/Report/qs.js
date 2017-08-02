import { RADIO, SHORT_ANSWER, LONG_ANSWER } from './enum';
export default [
  {
    title: null,
    fields: [
      {
        type: RADIO,
        brief: 'vibes',
        outOf: 5,
        q: 'General vibes of coffee date.',
      },
      {
        type: RADIO,
        brief: 'contributions',
        outOf: 5,
        q: 'Potential contributions of this rushee to meeting. This refers to LD and PB',
      },
      {
        type: RADIO,
        brief: 'enthusiasm',
        outOf: 5,
        q: 'Enthusiasm of rushee for A\'s gatherings outside of meeting. Estimated activity in the A\'s community.',
      },
      {
        type: RADIO,
        brief: 'honesty',
        outOf: 5,
        q: 'Did you feel like this rushee was being genuinely open and honest during the coffee?',
      },
      {
        type: RADIO,
        brief: 'listener',
        outOf: 5,
        q: 'To what extent did the rushee respectfully listen and engage with who you are?',
      },
      {
        type: SHORT_ANSWER,
        brief: 'rusheeDesc',
        q: 'One word to describe rushee.',
        placeholder: 'Wild',
      },
      {
        type: SHORT_ANSWER,
        brief: 'dateDesc',
        q: 'One word to describe the coffee date',
        placeholder: 'Wild',
      },
      {
        type: SHORT_ANSWER,
        brief: 'circumstances',
        q: 'Are there any extenuating circumstances that you think played a role in your coffee date? (i.e. you were tired, grumpy, stressed, jubilant, manic)',
        placeholder: 'Wild',
      },
    ],
  },
  {
    title: 'The Real Report',
    fields: [
      {
        type: LONG_ANSWER,
        brief: 'longAns',
        q: 'This should be around 1/2 page of typing. Why do you think this person is rushing? Was there anything that stood out to you during your coffee date? Was there anything that rubbed you the wrong way? Can you provide examples of openness and honesty? How well can this person keep a secret?',
      },
    ],
  },
];
