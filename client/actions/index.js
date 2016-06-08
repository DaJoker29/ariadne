export const CREATE_USER = 'CREATE_USER';

export function createUser(user) {
  console.log(user);
  return {
    type: CREATE_USER,
    user,
  };
}
