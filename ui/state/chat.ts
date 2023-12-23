import { get, writable } from 'svelte/store';
import type { API } from '../../app/api';

const models = writable<string[]>([]);
const model = writable<{ id: string; loading: boolean; progress: number; }>({ id: '', loading: false, progress: 0 });
const messages = writable<{ isResponse: boolean; text: string; }[]>([]);
const prompt = writable<string>('');
const processing = writable<boolean>(false);

const API: API = (window as any).API;

API.onModels((list) => (
  models.set(list)
));

API.onModel((id, loading, progress) => {
  model.set({ id, loading, progress });
  if (!loading) {
    messages.set([]);
    processing.set(false);
  }
});

API.onResponse((text, done) => {
  if (done) {
    processing.set(false);
    return;
  }
  messages.update(($messages) => {
    let last = $messages[$messages.length - 1];
    if (!last?.isResponse) {
      last = { isResponse: true, text: '' };
      $messages.push(last);
    }
    last.text += text;
    return $messages;
  });
});

export const Models = {
  subscribe: models.subscribe,
  list: API.models,
};

export const Model = {
  subscribe: model.subscribe,
  load: API.model,
  reset: API.reset,
  unload: API.unload,
};

export const Messages = {
  subscribe: messages.subscribe,
};

export const Prompt = {
  subscribe: prompt.subscribe,
  set: prompt.set,
  submit() {
    const text = get(prompt);
    messages.update(($messages) => ([...$messages, { isResponse: false, text }]));
    prompt.set('');
    processing.set(true);
    API.prompt(text);
  },
};

export const Processing = {
  subscribe: processing.subscribe,
};
