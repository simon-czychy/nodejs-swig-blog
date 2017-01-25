var chai = require('chai');
var expect = chai.expect;
global.util = require("util");
global.rdb = require('./../application/config/globals').RethinkDB();

describe("testIsUserAdmin", function() {
  var webUserMoule = require("./../application/models/Webuser");
  var validuser = { "level": "admin"}
  var invaliduser = { "name": "Invalid User", "level": "author"}
  console.log(webUserMoule.isUserAdmin(invaliduser));

  it('should return true when user.level equals "admin"', function() {
    expect(validuser).to.have.deep.property("level", "admin");
    expect(webUserMoule.isUserAdmin(validuser)).to.be.true;
  });

  it('should return false when user.level is not "admin"', function() {
    expect(webUserMoule.isUserAdmin(invaliduser)).to.be.false;
    expect(webUserMoule.isUserAdmin(undefined)).to.be.false;
    expect(webUserMoule.isUserAdmin(null)).to.be.false;
    expect(webUserMoule.isUserAdmin("this isinvalid")).to.be.false;
    expect(webUserMoule.isUserAdmin(0123456789)).to.be.false;
  });
});
