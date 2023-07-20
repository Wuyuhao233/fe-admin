import { defineMock } from '@umijs/max';

export default defineMock({
  'POST /api/userLogin': {
    data: 'thisIsTestString',
    code: 0,
    desc: 'success',
  },
  '/api/users/1': { id: 1, name: 'foo' },
  'GET /api/users/2': (req, res) => {
    res.status(200).json({ id: 2, name: 'bar' });
  },
});
