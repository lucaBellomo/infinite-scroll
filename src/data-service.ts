export interface User {
  id: string;
  name: string;
}

const users: User[] = Array(1000)
  .fill(undefined)
  .map((_, i) => ({ name: `user${i}`, id: `id_${i}` }));
const TOTAL_RECORDS = users.length;

const delay = () => new Promise((r) => setTimeout(r, 500));

// mock a fetch user function with pagination that returns a slice of users with a delay
export const fetchUsers = async ({ page = 0, limit = 100 }) => {
  const start = page * limit; // start index of the records
  const end = (page + 1) * limit; // end index of the records
  await delay();
  return {
    data: users.slice(start, end), //Slice the records from start to end
    done: end >= TOTAL_RECORDS,
  };
};

// the async generator function that fetch a 'page' of users when next() is called
export async function* fetchAllRecords({ page = 0, limit = 10 } = {}) {
  while (true) {
    const records = await fetchUsers({ page: page++, limit });
    yield records;
    if (records.done) return;
  }
}
