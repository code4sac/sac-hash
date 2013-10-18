#!/bin/bash
# Start / Stop script by Code4Sac
case "$1" in
start)
  printf "%-50s" "Starting get_tweets..."
  GT_PID=`php get_tweets.php > gt.log 2>&1 & echo $!`
  if [ -z $GT_PID ]; then
    printf "%s\n" "get_tweets failed"
  else
    echo $GT_PID > gt_pid.pid
    echo "PID: $GT_PID"
  fi
  printf "%-50s" "Starting parse_tweets..."
  PT_PID=`php parse_tweets.php > pt.log 2>&1 & echo $!`
  if [ -z $PT_PID ]; then
    printf "%s\n" "parse_tweets failed"
  else
    echo $PT_PID > pt_pid.pid
    echo "PID: $PT_PID"
  fi
;;
status)
  echo "Checking status of tables..."
  php db_test.php
  printf "%-50s" "Checking get_tweets..."
  if [ -f gt_pid.pid ]; then
    GT_PID=`cat gt_pid.pid`
    if [ -z "`ps -axf | grep ${GT_PID} | grep -v grep`" ]; then
      printf "%s\n" "Process dead but pidfile exists"
    else
      echo "Running"
    fi
  else
    printf "%s\n" "get_tweets not running"
  fi
  printf "%-50s" "Checking parse_tweets..."
  if [ -f pt_pid.pid ]; then
    PT_PID=`cat pt_pid.pid`
    if [ -z "`ps -axf | grep ${PT_PID} | grep -v grep`" ]; then
      printf "%s\n" "Process dead but pidfile exists"
    else
      echo "Running"
    fi
  else
    printf "%s\n" "parse_tweets not running"
  fi

;;
stop)
  printf "%-50s" "Stopping get_tweets..."
  GT_PID=`cat gt_pid.pid`
  if [ -f gt_pid.pid ]; then
    kill -HUP $GT_PID
    rm -f gt_pid.pid
    echo "Killed"
  else
    echo "PID File not found..."
  fi

  printf "%-50s" "Stopping parse_tweets..."
  PT_PID=`cat pt_pid.pid`
  if [ -f pt_pid.pid ]; then
    kill -HUP $PT_PID
    rm -f pt_pid.pid
    echo "Killed"
  else
    echo "PID File not found..."
  fi
;;
restart)
  $0 stop
  $0 start
;;

*)
  echo "Usage: $0 {status|start|stop|restart}"
  exit 1
esac
