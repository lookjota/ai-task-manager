import { faker } from '@faker-js/faker';

export function fakeUser() {
  return {
    email: faker.internet.email(),
    name: faker.person.fullName(),
    age: faker.number.int({ min: 18, max: 80 }),
  };
}

export function fakePost(authorId: number) {
  return {
    title: faker.lorem.sentence({ min: 3, max: 8 }),
    content: faker.lorem.paragraphs({ min: 1, max: 3 }),
    published: faker.datatype.boolean(),
    author_id: authorId,
  };
}

export function fakeTask() {
  return {
    title: faker.lorem.sentence({ min: 3, max: 8 }),
    description: faker.lorem.paragraph(),
    steps: JSON.stringify(Array.from({ length: faker.number.int({ min: 3, max: 7 }) }, () => faker.lorem.sentence())),
    estimated_time: `${faker.number.int({ min: 1, max: 14 })} days`,
    implementation_suggestion: faker.lorem.paragraph(),
    acceptance_criteria: JSON.stringify(Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, () => faker.lorem.sentence())),
    suggested_tests: JSON.stringify(Array.from({ length: faker.number.int({ min: 2, max: 4 }) }, () => `it('${faker.lorem.sentence()}')}`)),
    content: faker.lorem.paragraphs(2),
    chat_history: JSON.stringify([])
  };
}

