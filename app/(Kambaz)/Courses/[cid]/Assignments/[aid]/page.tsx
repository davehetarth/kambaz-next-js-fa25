export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor">
      <label htmlFor="wd-name"><h3>Assignment Name</h3></label> 
      <input id="wd-name" value="A1 - ENV + HTML" /><br /><br />
      <textarea  id="wd-description" style={{ width: '35%', height: '190px' }} >
        The assignment is available online Submit a link to the landing page of
        your webapplication running on netify . The landing page should include the following : your full Name
        and section links to each of the lab assignment Link to the kanbas application Links to all relevant 
        source code repo . The kanbas application should include a link to navigate back to the landing page .
      </textarea>
      <br /><br />
      <table>
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-points">Points</label>
          </td>
          <td>
                 <input id="wd-points" value={100} />
          </td>
        </tr><br />
        <tr>
            <td align="right" valign="top">
            <label htmlFor="wd-group">Assignment Group</label>
          </td>
          <td>
                <select id="wd-group">
                  <option value="Assignments">ASSIGNMENTS</option>
                </select>
          </td>
        </tr> <br />
        <tr>
            <td align="right" valign="top">
            <label htmlFor="wd-display-grade-as">Display Grade as</label>
          </td>
          <td>
                <select id="wd-display-grade-as">
                  <option value="percentage">Percentage</option>
                  <option value="marks">Marks</option>
                </select>
          </td>
        </tr><br />
        <tr>
            <td align="right" valign="top">
            <label htmlFor="wd-submission-type">Submission Type</label>
          </td>
          <td>
                <select id="wd-submission-type">
                  <option value="online">Online</option>
                  <option value="offline">Ofline</option>
                </select>
          </td>
        </tr><br />
        <tr>
            <td align="right" valign="top">
                <div>Online Entry Options</div>
            </td>
            <td>
                <input type="checkbox" name="check-genre" id="wd-text-entry"/>
                <label htmlFor="wd-text-entry">Text Entry</label><br/>
                <input type="checkbox" name="check-genre" id="wd-website-url"/>
                <label htmlFor="wd-website-url">Website URL</label><br/>
                <input type="checkbox" name="check-genre" id="wd-media-recordings"/>
                <label htmlFor="wd-media-recordings">Media Recordings</label><br/>
                <input type="checkbox" name="check-genre" id="wd-student-annotation"/>
                <label htmlFor="wd-student-annotation">Studnet Annotation</label><br/>
                <input type="checkbox" name="check-genre" id="wd-file-upload"/>
                <label htmlFor="wd-file-upload">File uploads</label><br/>
            </td>
        </tr><br />
        <tr>
            <td align="right" valign="top">
                <div>Assign Assign to</div>
            </td>
            <td>
                <input type="text" value="Everyone" id= "wd-assign-to" />
            </td>
        </tr><br />
        <tr>
            <td align="right" valign="top">
                Due
            </td>
            <td>
                <label htmlFor="wd-due-date"></label>
                <input type="date" value="2025-09-22" id="wd-due-date"/>
            </td>
        </tr> <br/>
        <tr>
            <td align="right" valign="top">
                Available From
            </td>
            <td>
                <label htmlFor="wd-available-from"></label>
                <input type="date" value="2025-09-10" id="wd-available-from"/>
            </td>
        </tr> <br/>
        <tr>
            <td align="right" valign="top">
                Until
            </td>
            <td>
                <label htmlFor="wd-available-until"></label>
                <input type="date" value="2025-09-22" id="wd-available-until"/>
            </td>
        </tr> <br/>
        <tr>
            <td align="right" valign="top">
            </td>
            <td>
                <button>Cancel</button>
                <button>Save</button>
            </td>
        </tr>
      </table>
    </div>
);}