import { message } from "antd";

/**
 * Every match must stay editable until results are submitted - including the
 * one that crowned the champion, since that is the easiest one to misclick.
 *
 * Opening the modal is always allowed; WhoWonModal locks the radio buttons for
 * an already-decided match and asks for the lock code. Once results have been
 * sent to the backend the match is closed for good, because the scores saved
 * server-side would no longer agree with the bracket.
 */
export function blockedBySubmission(hasSubmittedResults?: boolean): boolean {
  if (hasSubmittedResults) {
    message.info("Results have been submitted — this bracket is final.");
    return true;
  }
  return false;
}
