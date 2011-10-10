<?php

  function addressDateSelect($prefix, $defaultDate=null, $allowEmpty=true) {
      $startYear = strftime('%Y', strtotime('now'));
      ?>
      <span class="date-select">

          <select name="<?php echo $prefix ?>-month">
              <?php if ($allowEmpty) { ?><option></option><?php } ?>
    
              <?php for ($i=1; $i<=12; $i++) { ?>
                  <option <?php
                      if ($defaultDate and strftime('%m', $defaultDate) == $i)
                          echo 'selected="selected"';
                  ?> value="<?php echo $i ?>">
                      <?php echo date('F', mktime(0, 0, 1, $i, 1)) ?>
                  </option>
              <?php } ?>
          </select>
    
          <select name="<?php echo $prefix ?>-year">
              <?php if ($allowEmpty) { ?><option></option><?php } ?>
    
              <?php for ($i=$startYear; $i<=$startYear+3; $i++) { ?>
                  <option value="<?php echo $i ?>" <?php
                      if ($defaultDate and strftime('%Y', $defaultDate) == $i)
                          echo 'selected="selected"';
                  ?>><?php echo $i ?></option>
              <?php } ?>
          </select>
      </span>
  <?php
  }
?>
         
<?php                      
                      
$customQuestions = array(
    "tennis/olympics/wimbledon" => array(
        "q1" => "Please give details of any experience that your school has in playing, organising or taking part in tennis events and activities. If you do not have experience in tennis, please provide details of how you would ensure your pupils are given the best opportunity to be selected?",
        "q2" => "Please provide the names and DOB of the young people you will be bringing to selection.  Please remember you can bring up to 25 people from which seven will be chosen."
    ),
    "tennis/paralympics/eton manor" => array(
        "q1" => "Please give details of any experience that your school has in playing, organising or taking part in tennis events and activities. If you do not have experience in tennis, please provide details of how you would ensure your pupils are given the best opportunity to be selected?",
        "q2" => "Please provide the names and DOB of the young people you will be bringing to selection.  Please remember you can bring up to 25 people from which seven will be chosen."
    ),
    "taekwondo/olympics/excel" => array(
        "q1" => "What makes your YGM team different?",
        "q2" => "What experience (watching, playing, officiating) has your team had of Taekwondo, if any?"
    ),
    "swimming/olympics/olympic park" => array(
        "q1" => "What particular attitudes and behaviours will you be looking for in your YGMs?    ",
        "q2" => "What experience do the YGMs have of working together and taking direction, particularly in a high pressured environment? If limited experience, how would you prepare them for it?"
    ),
    "swimming/paralympics/olympic park" => array(
        "q1" => "What particular attitudes and behaviours will you be looking for in your YGMs?    ",
        "q2" => "What experience do the YGMs have of working together and taking direction, particularly in a high pressured environment? If limited experience, how would you prepare them for it?"
    ),
    "athletics/olympics/olympic park" => array(
        "q1" => "Have you participated in Kit Carrying for you Club/College before? If no, what do you understand by the role of a kit carrier is and what it entails?    ",
        "q2" => "What previous experience does the team have of performing this role, if you do have previous experience at what level of competition have you done this?"
    ),
    "athletics/paralympics/olympic park" => array(
        "q1" => "Have you ever assisted with a disability sports group or event before, if so how would you describe this experience?    ",
        "q2" => "During a sporting event, what do you think is key to working as a successful team?"
    ),
    "volleyball/olympics/excel" => array(
        "q1" => "Please give an example of how your organisation is involved in playing, organising or taking part in volleyball events and activities. If it does not have experience in these sports, please detail other relevant skills and/or experience that would help your team perform.    ",
        "q2" => "In what capacity have your young volunteers performed in a team and as leaders previously. Please give an example which demonstrates how your team has performed well together."
    ),
    "sitting volleyball/paralympics/excel" => array(
        "q1" => "Please give an example of how your organisation is involved in playing, organising or taking part in sitting volleyball events and activities. If it does not have experience in these sports, please detail other relevant skills and/or experience that would help your team perform.    ",
        "q2" => "In what capacity have your young volunteers performed in a team and as leaders previously. Please give an example which demonstrates how your team has performed well together."
    ),
    "beach volleyball/olympics/horse guards parade" => array(
        "q1" => "Please give an example of how your organisation is involved in playing, organising or taking part in Beach volleyball events and activities. If it does not have experience in these sports, please detail other relevant skills and/or experience that would help your team perform.    ",
        "q2" => "In what capacity have your young volunteers performed in a team and as leaders previously. Please give an example which demonstrates how your team has performed well together."
    ),
    "5 a side football/paralympics/olympic park" => array(
        "q1" => "Please give details of any experience that your school has in playing, organising or taking part in football and/or disability events and activities. If it does not have experience in football and/or disability football, please provide details of your schools other skills and/or experience that would help your team perform at the Paralympic 5-a-side Football event.    ",
        "q2" => "If a team from your school was successful and taken forward from the first selection days to additional training to learn how to be a Ball Kid how would you ensure your pupils were given the best opportunity to be selected as one of the final teams of Young Games Makers?"
    ),
    "7 a side football/paralympics/olympic park" => array(
        "q1" => "Please give details of any experience that your school has in playing, organising or taking part in football and/or disability events and activities. If it does not have experience in football and/or disability football, please provide details of your schools other skills and/or experience that would help your team perform at the Paralympic 7-a-side Football event.    ",
        "q2" => "If a team from your school was successful and taken forward from the first selection days to additional training to learn how to be a Ball Kid how would you ensure your pupils were given the best opportunity to be selected as one of the final teams of Young Games Makers?"
    ),
    "technology/olympics/aquatics centre" => array(
        "q1" => "Can you give me an example of where as a team/individuals within a team you have had to follow an established set of processes to perform a job/role/task?    ",
        "q2" => "Can you give another example of where you as a team/individuals within a team have had to work in a time pressured environment with a tight deadline?"
    ),
    "technology/olympics/city of coventry stadium" => array(
        "q1" => "Can you give me an example of where as a team/individuals within a team you have had to follow an established set of processes to perform a job/role/task?    ",
        "q2" => "Can you give another example of where you as a team/individuals within a team have had to work in a time pressured environment with a tight deadline?"
    ),
    "technology/olympics/earls court" => array(
        "q1" => "Can you give me an example of where as a team/individuals within a team you have had to follow an established set of processes to perform a job/role/task?    ",
        "q2" => "Can you give another example of where you as a team/individuals within a team have had to work in a time pressured environment with a tight deadline?"
    ),
    "technology/olympics/hadleigh farm, essex" => array(
        "q1" => "Can you give me an example of where as a team/individuals within a team you have had to follow an established set of processes to perform a job/role/task?    ",
        "q2" => "Can you give another example of where you as a team/individuals within a team have had to work in a time pressured environment with a tight deadline?"
    ),
    "technology/olympics/hampden park" => array(
        "q1" => "Can you give me an example of where as a team/individuals within a team you have had to follow an established set of processes to perform a job/role/task?    ",
        "q2" => "Can you give another example of where you as a team/individuals within a team have had to work in a time pressured environment with a tight deadline?"
    ),
    "technology/olympics/hyde park" => array(
        "q1" => "Can you give me an example of where as a team/individuals within a team you have had to follow an established set of processes to perform a job/role/task?    ",
        "q2" => "Can you give another example of where you as a team/individuals within a team have had to work in a time pressured environment with a tight deadline?"
    ),
    "technology/olympics/lee valley" => array(
        "q1" => "Can you give me an example of where as a team/individuals within a team you have had to follow an established set of processes to perform a job/role/task?    ",
        "q2" => "Can you give another example of where you as a team/individuals within a team have had to work in a time pressured environment with a tight deadline?"
    ),
    "technology/olympics/millennium stadium" => array(
        "q1" => "Describe a time when you/your team have followed an established set of processes to perform a job/role/task?",
        "q2" => "Can you give another example of where you as a team/individuals within a team have had to work in a time pressured environment with a tight deadline?"
    ),
    "technology/olympics/old trafford" => array(
        "q1" => "Can you give me an example of where as a team/individuals within a team you have had to follow an established set of processes to perform a job/role/task?    ",
        "q2" => "Can you give another example of where you as a team/individuals within a team have had to work in a time pressured environment with a tight deadline?"
    ),
    "technology/olympics/royal artillery barracks" => array(
        "q1" => "Can you give me an example of where as a team/individuals within a team you have had to follow an established set of processes to perform a job/role/task?    ",
        "q2" => "Can you give another example of where you as a team/individuals within a team have had to work in a time pressured environment with a tight deadline?"
    ),
    "technology/olympics/st james' park" => array(
        "q1" => "Can you give me an example of where as a team/individuals within a team you have had to follow an established set of processes to perform a job/role/task?    ",
        "q2" => "Can you give another example of where you as a team/individuals within a team have had to work in a time pressured environment with a tight deadline?"
    ),
    "technology/olympics/the mall" => array(
        "q1" => "Can you give me an example of where as a team/individuals within a team you have had to follow an established set of processes to perform a job/role/task?    ",
        "q2" => "Can you give another example of where you as a team/individuals within a team have had to work in a time pressured environment with a tight deadline?"
    ),
    "technology/olympics/water polo arena" => array(
        "q1" => "Can you give me an example of where as a team/individuals within a team you have had to follow an established set of processes to perform a job/role/task?    ",
        "q2" => "Can you give another example of where you as a team/individuals within a team have had to work in a time pressured environment with a tight deadline?"
    ),
    "technology/olympics/wembley stadium" => array(
        "q1" => "Can you give me an example of where as a team/individuals within a team you have had to follow an established set of processes to perform a job/role/task?    ",
        "q2" => "Can you give another example of where you as a team/individuals within a team have had to work in a time pressured environment with a tight deadline?"
    ),
    "technology/olympics/weymouth &amp; portland" => array(
        "q1" => "Can you give me an example of where as a team/individuals within a team you have had to follow an established set of processes to perform a job/role/task?    ",
        "q2" => "Can you give another example of where you as a team/individuals within a team have had to work in a time pressured environment with a tight deadline?"
    ),
    "technology/olympics/wimbledon" => array(
        "q1" => "Can you give me an example of where as a team/individuals within a team you have had to follow an established set of processes to perform a job/role/task?    ",
        "q2" => "Can you give another example of where you as a team/individuals within a team have had to work in a time pressured environment with a tight deadline?"
    ),
    "technology/paralympics/aquatics centre" => array(
        "q1" => "Can you give me an example of where as a team/individuals within a team you have had to follow an established set of processes to perform a job/role/task?    ",
        "q2" => "Can you give another example of where you as a team/individuals within a team have had to work in a time pressured environment with a tight deadline?"
    ),
    "technology/paralympics/eton dorney" => array(
        "q1" => "Can you give me an example of where as a team/individuals within a team you have had to follow an established set of processes to perform a job/role/task?    ",
        "q2" => "Can you give another example of where you as a team/individuals within a team have had to work in a time pressured environment with a tight deadline?"
    ),
  "technology/paralympics/excel" => array(
      "q1" => "Can you give me an example of where as a team/individuals within a team you have had to follow an established set of processes to perform a job/role/task?    ",
      "q2" => "Can you give another example of where you as a team/individuals within a team have had to work in a time pressured environment with a tight deadline?"
  ),
    "technology/paralympics/weymouth &amp; portland" => array(
        "q1" => "Can you give me an example of where as a team/individuals within a team you have had to follow an established set of processes to perform a job/role/task?    ",
        "q2" => "Can you give another example of where you as a team/individuals within a team have had to work in a time pressured environment with a tight deadline?"
    )
);
                      
?>
