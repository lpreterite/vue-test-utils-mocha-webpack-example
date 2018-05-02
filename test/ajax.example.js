describe('mocking axios requests', function () {
    let mock;
    before(function(){
        mock = new MockAdapter(axios);
    })
    after(function(){
        mock.restore();
    })

    describe('GET request test', function () {
        afterEach(function () {
            mock.reset();
        });

        it('should get some users', async function (){
            mock
                .onGet('/users')
                .reply(200, {
                    users: [
                        { id: 1, name: 'John Smith' },
                        { id: 2, name: 'Packy Tang' }
                    ]
                });

            const result = await axios.get('/users').then(res=>res.data);
            assert.sameDeepMembers(result.users, [
                { id: 1, name: 'John Smith' },
                { id: 2, name: 'Packy Tang' }
            ]);
        })
        it('should search user by name', async () => {
            mock
                .onGet('/users', { params: { searchText: 'John' } })
                .reply(200, {
                    users: [
                        { id: 1, name: 'John Smith' }
                    ]
                });

            const result = await axios.get('/users', { params: { searchText: 'John' } }).then(res => res.data);
            assert.sameDeepMembers(result.users, [
                { id: 1, name: 'John Smith' }
            ]);
        })
    })

    describe('POST request test', function () {
        it('should return new user with id', async function () {
            mock
                .onPost('/user', { name: 'Cathy Yan' })
                .reply(200, { id: 3, name: 'Cathy Yan' });

            const result = await axios.post('/user', { name: 'Cathy Yan' }).then(res => res.data);
            assert.propertyVal(result, 'id', 3);

            mock.reset();
        })
    });
})