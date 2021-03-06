var app = require('../../../app');
var request = require('supertest')(app);
var should = require('should');
var support = require('../../support/support');


describe('test/api/v2/node.test.js', function () {

    var mockNode, mockNodeParent;

    before(function (done) {
        support.createNode(support.adminUser._id, null, function (err, node) {
            mockNodeParent = node;
            support.createNode(support.adminUser._id, node._id, function (err, node2) {
                mockNode = node2;
                done();
            });
        });
    });

    describe('get /api/v2/nodes', function () {
        it('should return nodes', function (done) {
            request.get('/api/v2/nodes')
                .set('Authorization', 'Bearer ' + support.normalUser.accessToken)
                .end(function (err, res) {
                    should.not.exists(err);
                    res.body.success.should.false();
                    res.text.should.containEql('q 不能为空');
                    done();
                });
        });

        it('should find nodes with param q="node name" and not login', function (done) {
            request.get('/api/v2/nodes')
                .query({
                    q: 'node name'
                })
                .end(function (err, res) {
                    should.not.exists(err);
                    res.body.success.should.true();
                    res.body.data.length.should.equal(2);
                    res.text.should.not.containEql(mockNodeParent.title);
                    done();
                });
        });

        it('should find nodes with param q="node name" and login', function (done) {
            request.get('/api/v2/nodes')
                .query({
                    q: 'node name'
                })
                .set('Authorization', 'Bearer ' + support.normalUser.accessToken)
                .end(function (err, res) {
                    should.not.exists(err);
                    res.body.success.should.true();
                    res.body.data.length.should.equal(2);
                    done();
                });
        });

        it('should find none of nodes with param q="nothing can find" ', function (done) {
            request.get('/api/v2/nodes')
                .query({
                    q: 'nothing can find'
                })
                .set('Authorization', 'Bearer ' + support.normalUser.accessToken)
                .end(function (err, res) {
                    should.not.exists(err);
                    res.body.success.should.true();
                    res.body.data.length.should.equal(0);
                    done();
                });
        });
    });

});
