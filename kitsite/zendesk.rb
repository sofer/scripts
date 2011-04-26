# #!/usr/local/bin/ruby

require 'rubygems'
require 'hpricot'  
require 'net/http'

$zen_auth = 'ZGFubnlAa2l0c2l0ZS5jb20vdG9rZW46V1pDS0FUdmZyVXhpWWt4RFFNQ0VNS2NzTVZWd3dBVndNcWh4R2VMMw=='
$headers = { 'Authorization' =>  $zen_auth }
$host = "postcms.zendesk.com"

def humanize(name)
  return name.gsub('_', ' ')
end

#RestClient.log = 'restclient.log'
$zen_reports = {
  '2435469' => {
  	   'title' => 'This week\'s priorities', 
	   'comment' => "",
	   'exclude' => ['solved_at', 'billable', 'billable_days', 'authorized', 'updated_at']
	   },
  '905859' => {
  	   'title' => 'Open, high and urgent priority', 
	   'comment' => "A due date will be added to a ticket only after you have requested a date in a comment on a ticket and we have confirmed it on the same ticket. Any due dates without a comment trail are likely to have been added in error by us and will be removed unless requested otherwise.",
	   'exclude' => ['solved_at', 'billable', 'billable_days', 'authorized', 'updated_at']
	   },
  '906070' => {
  	   'title' => 'Open, lower priority', 
	   'comment' => "It would be helpful if you could take a look at issues posted by other members of the team and leave a comment about whether you are happy to authorize the request. You can also request upgrading of work on this list to 'High' or request a deadline.",
	   'exclude' => ['solved_at', 'billable_days', 'due_date', 'updated_at']},
  '905871' => {
  	   'title' => 'Pending (awaiting feedback)', 
	   'comment' => "Check these regularly, particularly the ones near the top. Follow the link under 'ticket' and respond to the ticket.",
	   'exclude' => ['created_at', 'solved_at', 'billable', 'billable_days', 'authorized', 'points']},
  '449562' => {
  	   'title' => 'Recently completed', 
	   'comment' => "A rolling list of tickets that we have recently marked as solved. Check this regularly and leave a comment on a ticket if you have a query",
	   'exclude' => ['due_date', 'status', 'updated_at', 'points']},
  '949922' => {
  	   'title' => 'Recently billed', 
	   'comment' => "A rolling list of tickets that we have recently marked as solved and billable. If you are not sure about any of these, please leave a comment on the ticket. See <a href=\"https://sofer.dabbledb.com/page/london2012/aAyInRgx#\">Billing history</a>.",
	   'exclude' => ['due_date', 'status', 'updated_at']}
}

def links()
  html = ''
  $zen_reports.each { |k,v| 
    html += %Q@<a href="#{k}.html">#{v['title']}</a> | \n@
  }
  html += %Q@<a href="generate.cgi">Refresh all reports</a>@
  return html
end

def page(body)
  return <<HTML
<html>
  <head>
  <title>ZenDesk reports</title>
  <link rel="stylesheet" type="text/css" media="all" href="style.css">
  </head>
  <body>
  #{body}
  </body>
</html>
HTML
end

def index
  return links
end

def report(id)
  cols = [ 'ticket', 'subject', 'requested_by', 'created_at', 'updated_at', 'solved_at', 'status', 'billable', 'points', 'billable_days', 'authorized', 'priority', 'due_date' ]
  rows = []
  path = "/rules/#{id}.xml"
  resp = Net::HTTP.start($host) {|http|
    http.get(path, $headers)
  }
  tickets = Hpricot(resp.body)
  tickets.search("tickets/ticket").each do |ticket| 
    row = {}
    ticket_id = ticket.at("nice-id").inner_html
    row['ticket'] = %Q|<a href="http://postcms.zendesk.com/tickets/#{ticket_id}">#{ticket_id}</a>|
    row['subject'] = ticket.at("subject").inner_html
    row['requested_by'] = ticket.at("req-name").inner_html
    row['created_at'] = ticket.at("created-at").inner_html.match(/^(\d\d\d\d-\d\d-\d\d)/)[0]
    row['solved_at'] = ticket.at("solved-at").inner_html.match(/^(\d\d\d\d-\d\d-\d\d)/)[0] unless $zen_reports[id]['exclude'].include? 'solved_at'
    row['updated_at'] = ticket.at("updated-at").inner_html.match(/^(\d\d\d\d-\d\d-\d\d)/)[0] unless $zen_reports[id]['exclude'].include? 'updated_at'
    row['status'] = ticket.at("status-id").inner_html
    row['billable'] = ticket.at("field-147056").inner_html unless $zen_reports[id]['exclude'].include? 'billable'
    row['points'] = ticket.at("field-110059").inner_html unless $zen_reports[id]['exclude'].include? 'points'
    row['billable_days'] = ticket.at("field-177410").inner_html unless $zen_reports[id]['exclude'].include? 'billable_days'
    row['authorized'] = ticket.at("field-148059").inner_html  unless $zen_reports[id]['exclude'].include? 'authorized'
    row['priority'] = ticket.at("priority-id").inner_html
    row['priority'] = case row['priority']
    	when '4': 'Urgent'
	when '3': 'High'
	when '2': 'Normal'
	when '1': 'Low'
	when '0': '-'
    end
    match = ticket.at("due-date").inner_html.match(/^(\d\d\d\d-\d\d-\d\d)/)
    row['due_date'] = match ? match[0] : ''
    row['TICKET'] = %Q|<a href="http://postcms.zendesk.com/tickets/#{row['ticket_id']}">TICKET</a>|
    rows << row
  end

  ths = ''
  cols.each do |col|
    unless $zen_reports[id]['exclude'].include? col
      ths += "<th>#{humanize(col)}</th>"
    end
  end
  trs = ''
  rows.each do |row|
    trs += "<tr>"
    cols.each do |col|
      unless $zen_reports[id]['exclude'].include? col
        td = humanize row[col]
        trs += "<td>#{td}</td>"
      end
    end
    trs += "</tr>\n"
  end

  return <<HTML
  #{links}
<br><br>
<div class="note">Generated on #{Time.now.utc}</div>
<h1>#{$zen_reports[id]['title']}</h1>
<div>#{$zen_reports[id]['comment']}</div>
<br>
<table>
<tr>#{ths}</tr>
#{trs}
</table>
<div class="note">Please note: only the most recent 30 records are displayed here</div>
HTML
end

puts "starting..."

$zen_reports.each_key do |key|
  f = File.open("#{key}.html", 'w')
  f.puts page report(key)
  f.close
end

puts "finished, apparently"

