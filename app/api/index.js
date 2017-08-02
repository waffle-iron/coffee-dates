/**
 * Basic wrapper around the Parse JS SDK. Will possibly be shifted to
 * a different backend/db in the future, hence this wrapper.
 *
 * NB: I should really do the data formatting logic on the server side,
 *     but it's all client-side at the moment due to time constraints.
 */
import Parse from 'parse';

Parse.serverURL = (process.env.NODE_ENV === 'development') ? 'http://localhost:1337/parse' : 'http://104.236.103.224/server';
Parse.initialize('8683A294D744F6A55879C13E8374A', 'XgsxILrjVR2v45f7a43gY9VfV60WFMGp');

const Member = Parse.Object.extend('Member');
const Rushee = Parse.Object.extend('Rushee');
const Report = Parse.Object.extend('Report');

/* NB: Errors for promise chains need to be handled in the appropriate saga */

export function fetchLogin(username, password) {
  return Parse.User.logIn(username, password);
}

export function fetchMember(lastname) {
  const query = new Parse.Query(Member);
  query.equalTo('lastname', lastname);
  return query.find()
    .then(members => {
      if (members.length !== 1) {
        throw new Error(`More than one member with lastname ${lastname} in database. Please alert admin.`);
      }
      return members[0];
    });
}

export function fetchRushees() {
  const query = new Parse.Query(Rushee);
  query.ascending('lastname'); // sort in alphabetical order by lastname
  return query.find();
}

// TODO: pass in current member object here as well so that updating is straightforward.
export function pushField(key, value, memberId) {
  return Promise.resolve().then(() => {
    const currentMember = new Member();
    currentMember.set('objectId', memberId);
    currentMember.set(key, value);
    return currentMember.save()
      .then(member => member.get(key));
  });
}

export function pushReport(report, rushee, member) {
  const newReport = new Report();
  newReport.set('memberId', member.objectId);
  newReport.set('rusheeId', rushee.objectId);
  const fields = {};
  Object.keys(report).forEach(pageNo => {
    Object.keys(report[pageNo]).forEach(key => {
      fields[key] = report[pageNo][key];
      // newReport.set(key, report[pageNo][key]);
    });
  });
  // TODO: implement report error if fields are not full.
  newReport.set('fields', fields);
  return newReport.save();
}

export function removeRushee(rushee, member) {
  /* members as Parse classes for association in backend */
  /* variation of member w/o nested fields */
  /* note: this is a fairly complex logic that should really be in the backend, at an endpoint */
  const newMember = new Member();
  newMember.id = member.objectId;
  newMember.set('email', member.email);
  newMember.set('pending_rushees', member.pending_rushees.filter(r => (r.email !== rushee.email)));
  newMember.set('completed_cds', member.completed_cds.concat([{
    objectId: rushee.objectId,
    firstname: rushee.firstname,
    lastname: rushee.lastname,
    email: rushee.email,
  }]));
  const newRushee = new Rushee();
  newRushee.id = rushee.objectId;
  newRushee.set('email', rushee.email);
  if (rushee.pending_member && rushee.pending_member.id === member.objectId) {
    newRushee.set('pending_member', null);
  } else {
    newRushee.set('second_pending_member', null);
  }
  newRushee.set('completed_cds', rushee.completed_cds.concat([{
    objectId: member.objectId,
    firstname: member.firstname,
    lastname: member.lastname,
    email: member.email,
  }]));

  return newRushee.save()
    .then(() => newMember.save());
}
