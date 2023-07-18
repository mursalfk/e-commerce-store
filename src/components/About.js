import React from "react";

const About = () => {
  return (
    <section className="hero is-primary is-fullheight">
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-half">
              <h1 className="title">About</h1>
              <div className="content">
                <p className="subtitle">Project Submitted by:</p>
                <table className="table is-bordered is-striped is-narrow is-hoverable">
                  <thead>
                    <tr>
                      <th>Student ID</th>
                      <th>Student Name</th>
                      <th>Student Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>2047419</td>
                      <td>Mursal Furqan Kumbhar</td>
                      <td>kumbhar.2047419@studenti.uniroma</td>
                    </tr>
                    <tr>
                      <td>2053796</td>
                      <td>Srinjan Ghosh</td>
                      <td>ghosh.2053796@studenti.uniroma1.it</td>
                    </tr>
                  </tbody>
                </table>
                <p className="profName">Submitted to: Prof. Emiliano Casalicchio</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
