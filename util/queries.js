/**
 * @Author Tanner Brown
 * @type {string}
 *
 * Stores DB queries as constants to save codespace and reuse.
 */

//***************** CONNECTION QUERIES **********//
const PROPOSE_CONNECTION = `INSERT INTO contacts (memberid_a, memberid_b, requested_by)
                            SELECT $1, $2, $3
                            WHERE NOT EXISTS(
                                        SELECT memberid_a, memberid_b
                                        FROM contacts
                                        WHERE memberid_a = $1 and memberid_b = $2
                                           OR memberid_a = $2 and memberid_b = $1
                                );`;

const REMOVE_CONNECTION = `DELETE FROM contacts 
                              WHERE (memberid_b = $1 AND memberid_a = $2)
                                OR(memberid_a = $1 AND memberid_b = $2);`;

const ACCEPT_CONNECTION = `UPDATE contacts SET verified = 1
                           WHERE verified = 0
                                   AND (memberid_a = $1 AND "memberid_b" = $2)
                              OR (memberid_a = $2 AND memberid_b = $1);`;

const FIND_UNIQUE_CONTACT = `SELECT DISTINCT memberid, firstname, lastname, username, email
                                FROM members
                                    WHERE memberid != $1
                                        AND (email ILIKE $2 OR username ILIKE $2);`;

const FIND_CONTACT_BYREST = `SELECT DISTINCT memberid, firstname, lastname, username, email
                                   FROM members
                                    WHERE memberid != $1
                                        AND (username ~* $2 OR firstname ~* $2 OR lastname ~* $2);`;



const GET_ALL_CONTACTS = `SELECT DISTINCT Contacts.requested_by as requester_id, Members.email, Members.memberid, Members.firstname, Members.lastname, Members.username, Contacts.verified
                          FROM Members
                                 INNER JOIN Contacts
                                   ON (Members.MemberID = Contacts.memberid_a AND Contacts.memberid_b = $1)
                                        OR (Members.MemberID = Contacts.memberid_b AND Contacts.memberid_a = $1);`;


CONNECTION_QUERIES = {PROPOSE_CONNECTION, ACCEPT_CONNECTION, FIND_UNIQUE_CONTACT, FIND_CONTACT_BYREST, GET_ALL_CONTACTS, REMOVE_CONNECTION};

//***************** MESSAGING QUERIES **********//

const GET_CHATID_BY_NAME = `SELECT chatid FROM chats WHERE name =$1`;


const ADD_MEMBER_TO_CHAT = `INSERT into chatmembers(chatid, memberid) SELECT $1, $2 WHERE not exists(SELECT 1 from chatmembers where chatid = $1 and memberid = $2);`;

const ADD_MEMBERS_TO_CHATROOM = `INSERT into chatmembers(chatid, memberid) SELECT($1, $2),($3, $4) WHERE not exists(select 1 from chatmembers where chatid = $1 and memberid = $2);`;

const CREATE_CHATROOM = `INSERT into chats(name) VALUES($1)`; //where where not exists (select 1 from hats where name = 42);

const CREATE_CHATROOM_NOT_EXISTS = `INSERT INTO chats(name) SELECT $1 where not exists (select 1 from chats where name = $1) returning chats.chatid`;

const INSERT_MESSAGE = `INSERT INTO Messages(ChatId, Message, MemberId)
                        SELECT $1, $2, MemberId FROM Members
                        WHERE username=$3;`;

const GET_ALL_CHATS_BY_MEMBERID = `SELECT *
                                   FROM chats
                                          JOIN chatmembers ON chatmembers.chatid = chats.chatid
                                   WHERE chatmembers.memberid = $1;`;

const GET_ALL_MESSAGES_BY_CHATID = `SELECT Members.username, Messages.Message, Members.memberid,
                                           to_char(Messages.Timestamp AT TIME ZONE 'PDT', 'YYYY-MM-DD HH24:MI:SS.US' ) AS Timestamp
                                    FROM Messages
                                           INNER JOIN Members ON Messages.MemberId=Members.MemberId
                                    WHERE ChatId=$1
                                    ORDER BY Timestamp ASC;`;

const GET_ALL_MY_MESSAGES = `SELECT *
                             FROM chats
                                    JOIN chatmembers ON chatmembers.chatid = chats.chatid
                                    JOIN messages ON messages.chatid = chats.chatid
                             WHERE chatmembers.memberid = $1;`;

const GET_ALL_TOKENS_IN_A_CHAT = `SELECT token FROM fcm_token JOIN chatmembers on chatmembers.memberid = fcm_token.memberid WHERE chatmembers.chatid = $1;`;

const REMOVE_CHATMEMBERS_BY_CHATID = `DELETE FROM chatmembers WHERE chatid = $1;`;

const REMOVE_CHATS_BY_CHATID = `DELETE from chats where chatid = $1;`;

MESSAGING_QUERIES = {REMOVE_CHATS_BY_CHATID, REMOVE_CHATMEMBERS_BY_CHATID, GET_CHATID_BY_NAME, CREATE_CHATROOM, ADD_MEMBERS_TO_CHATROOM, INSERT_MESSAGE, GET_ALL_MESSAGES_BY_CHATID, GET_ALL_TOKENS_IN_A_CHAT, GET_ALL_CHATS_BY_MEMBERID, GET_ALL_MY_MESSAGES, CREATE_CHATROOM_NOT_EXISTS, ADD_MEMBER_TO_CHAT};


const VERIFY_USER_ACCOUNT = "UPDATE members SET verification = 1 WHERE email =$1";

const INSERT_NEW_MEMBER = 'INSERT INTO MEMBERS(FirstName, LastName, Username, Email, Password, Salt) VALUES ($1, $2, $3, $4, $5, $6)';

const GET_FB_TOKEN_BY_USERNAME = 'SELECT fcm_token.token FROM fcm_token JOIN Members on Members.memberid = fcm_token.memberid WHERE Members.username = $1;';

const GET_FB_TOKEN_BY_ID = `SELECT token FROM fcm_token WHERE memberid = $1;`;

const GET_USERDATA_BY_EMAIL = 'SELECT memberid, firstname, lastname, username, email, verification FROM Members WHERE Email=$1';

const UPDATE_PASSWORD = `UPDATE members SET password = $1, salt = $2 WHERE email = $3;`;

MISC_QUERIES = {VERIFY_USER_ACCOUNT, INSERT_NEW_MEMBER, GET_FB_TOKEN_BY_USERNAME, GET_FB_TOKEN_BY_USERNAME, GET_USERDATA_BY_EMAIL, GET_FB_TOKEN_BY_ID, UPDATE_PASSWORD};

ALL_QUERIES = {REMOVE_CHATS_BY_CHATID, REMOVE_CHATMEMBERS_BY_CHATID, VERIFY_USER_ACCOUNT, INSERT_NEW_MEMBER, GET_FB_TOKEN_BY_USERNAME, GET_FB_TOKEN_BY_USERNAME, GET_USERDATA_BY_EMAIL, GET_FB_TOKEN_BY_ID, GET_CHATID_BY_NAME,
    CREATE_CHATROOM, ADD_MEMBERS_TO_CHATROOM, INSERT_MESSAGE, GET_ALL_MESSAGES_BY_CHATID, GET_ALL_TOKENS_IN_A_CHAT, GET_ALL_CHATS_BY_MEMBERID,
    GET_ALL_MY_MESSAGES, CREATE_CHATROOM_NOT_EXISTS, ADD_MEMBER_TO_CHAT, PROPOSE_CONNECTION, ACCEPT_CONNECTION, FIND_UNIQUE_CONTACT, FIND_CONTACT_BYREST, GET_ALL_CONTACTS, REMOVE_CONNECTION, UPDATE_PASSWORD};

module.exports = {
    CONNECTION_QUERIES, MESSAGING_QUERIES, MISC_QUERIES, ALL_QUERIES
};