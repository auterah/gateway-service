import * as moment from 'moment';

export class BillingUtils {
  /**
   * If billAt - todayDate = 0 THEN customer is billable.
   * @billAt {number} billAt: Date | string.
   * @return {boolean} If diff = 0 therefore !diff = false & vice versa.
   */
  static billIsDue(billAt: Date | string): boolean {
    const diff = moment(new Date()).diff(moment(billAt), 'days');
    return !diff;
  }
}
