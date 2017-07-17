
#This imports your dependencies 
import os
import json
import re
import csv
import pprint
import numpy



#participant numbers
partno = [10244]


#load TrueColours JSON all participants clump, this will be GROUPED BY PARTICIPANT from TrueColours 
	
	#ENTER YOUR JSON PATH HERE
	#e.g. 'home/irvinea/Documents/TC_Games/caseload.json'
input_tc_path = 'caseload.json'
TC_data = open(input_tc_path).read()
TC_data = json.loads(TC_data)

	#ENTER YOUR OUTPUT PATH HERE
	#e.g. 'home/irvinea/Documents/TC_Games/'
input_output_path = 'output/'

#Loop through all the inputted true colour numbers:
for part in partno: 

	#Let's declare anew all of the variables we intend to store for each participant: 

	#Whack-a-T variables
	RT_wt = []
	correct_wt = []
	trial_type_wt = []
	session_wt = []
	date_wt = []
	days_wt = []
	nr_trials_wt = []
	moodpreegam_wt = []
	moodpostgam_wt = []

	#Wheel of Fortune
	Lcircleprobwin_wf = []
	Lcirclegain_wf =[]
	Lcircleloss_wf = []
	Rcircleprobwin_wf = []
	Rcirclegain_wf = []
	Rcircleloss_wf = []
	Choice_wf = []
	gainloss_wf = []
	nearclear_1_wf = []
	nearclear_2_wf = []
	totalscore_wf = []
	RT_wf = []
	testday_wf = []
	actualday_wf = []
	moodpreegam_wf = []
	moodpostgam_wf = []
	meanmoodday_wf = []

	#Fractals variables 
		#Summary Pairs
	date_pair_fr = []
	days_pair_fr = []
	choice_pair_fr = []
	RT_pair_fr = []
	fracchosennr_pair_fr = []
	fracchosenrew_pair_fr = []
	fracchosenprob_pair_fr = []
	fracothernr_pair_fr = []
	fracotherreward_pair_fr = []
	fracotherprob_pair_fr = []
		#Free Choice
	date_free_fr = []
	day_free_fr = []
	fracchosennr_free_fr = []
	fracchosenrew_free_fr = []
	fracotherprob_free_fr = []
		#Data summary guesses
	date_guess_fr = []
	day_guess_fr = []
	fracnr_guess_fr = []
	fracguessmag_guess_fr = []
	fracmagn_guess_fr = []
	fracguessprob_guess_fr = []
	fracprob_guess_fr = [] 
		#mood ratings
	fr_mood_before = []
	fr_rt_before = []
	fr_mood_after = []
	fr_rt_after = []
	mood_day = []
	mood_date = []

	# #Guess the gap variables
	# 	#Data Summary Minigame
	# date_mini_gg = []
	# day_mini_gg = []
	# score_mini_gg = []
	# RTdifference_mini_gg = []
	# delay1_mini_gg = []
	# delay2_mini_gg = []
	# #might be helpful
	# RT_mini_gg = []
	# totalScore_mini_gg = []

	# 	#Data Summary Guesses
	# date_guess_gg = []
	# day_guess_gg = []
	# preguess_guess_gg = []
	# postguess_guess_gg = []
	# preguessRT_guess_gg = []
	# postguessRT_guess_gg = []
	# bonuspre_guess_gg = []
	# bonuspost_guess_gg = []

	#Counters for number of each session completed 
	sess_wt = 0
	sess_fr = 0
	# sess_gg = 0
	sess_wf = 0

	#Make a blank variable to assign completion information to. This can then be printed to the console for later verification
	valid_days = []
	
	#idenify number of sessions for each participant (these can be different games)
	#Note: these will contain EVERYTHING the participant has ever done (potentially fairly long)
	sessno = len(TC_data['tcid-' + str(part)])

	#check which sessions contain valid TC_data from the tasks we are interested in?
	#This is neccesary because they can have other data from other third party tasks that we have no interest in 


	#loop through all sessions
	for sess in range(sessno):
		try:
			#If data does not exist for this session, this will throw an exception, which is caught below.
			TC_data['tcid-' + str(part)][sess]['data']['response'][0]
		except KeyError:
			valid_days.append(0)
		except TypeError: 
			valid_days.append(0)
		else:
			valid_days.append(1)

			#This gives us the name of the game played in the session 
			temp_game_id = TC_data['tcid-' + str(part)][sess]['data']['name']
			temp_date = TC_data['tcid-' + str(part)][sess]['response_date']
			
			#This is our data for the session 
			tempdat = TC_data['tcid-' + str(part)][sess]['data']['response']

			#now we need a series of if conditions that identify which game this session is, and which trial it is: 

			#Whack-a-T Game 
			if temp_game_id == 'Whack-a-T':
				sess_wt+= 1 #register with the counter that this is a whack a T session(and one)
				#loop through all of the entries in JSON for this session (the -1 is because JSON and python work with 0 as the first number - unlike matlab)
				for i in range(len(tempdat))[1:-2]:
						RT_wt.append(tempdat[i]['selectedData']['rt'])

						#If they clicked a T then score correct as 1, else store it as 0 
						if tempdat[i]['selectedData']['data'] =='T':
							correct_wt.append(1)
						else:
							correct_wt.append(0)
						trial_type_wt.append(tempdat[i]['configArray']['type'])
						session_wt.append(sess_wt)
						date_wt.append(temp_date)


						days_wt.append(tempdat[i]['day'])
						#Subtract 2 from the length, as the first and last two entries in a whack-a-t session will be the emotion ratings and the summary stat 
						nr_trials_wt.append(len(tempdat)-3)
						print('done')

						
						moodpreegam_wt.append(tempdat[0]['feelingRate'])
						moodpostgam_wt.append(tempdat[-2]['feelingRate'])


			#Wheel of Fortune
			if temp_game_id == 'Wheel of Fortune':
				sess_wf+= 1 #register with the counter that this is a whack a T session(and one)
				#loop through all of the entries in JSON for this session 
				# excludes first and last items [1:-1] (as these are mode ratings)
				for i in range(len(tempdat))[1:-1]:
					
					Lcircleprobwin_wf.append(tempdat[i]['TrialData'][0][0])
					Lcirclegain_wf.append(tempdat[i]['TrialData'][0][1])
					Lcircleloss_wf.append(tempdat[i]['TrialData'][0][2])

					Rcircleprobwin_wf.append(tempdat[i]['TrialData'][1][0])
					Rcirclegain_wf.append(tempdat[i]['TrialData'][1][1])
					Rcircleloss_wf.append(tempdat[i]['TrialData'][1][2])	

					Choice_wf.append(tempdat[i]['side'])
					gainloss_wf.append(tempdat[i]['score'])
					nearclear_1_wf.append(tempdat[i]['nearBound_1'])
					nearclear_2_wf.append(tempdat[i]['nearBound_2'])
					totalscore_wf.append(tempdat[i]['total'])
					RT_wf.append(tempdat[i]['rt'])
					testday_wf.append(sess_wf)
					actualday_wf.append(temp_date)

					#Mood is rated on the last day 
					moodpostgam_wf.append(tempdat[-1]['feelingRate'])
					moodpreegam_wf.append(tempdat[0]['feelingRate'])
					meanmoodday_wf.append(numpy.nan)


			
			#Fractals Game 
			if temp_game_id == 'Fractals':
				sess_fr+=1
				for i in range(len(tempdat))[0:-1]:
					
					if 'feelingRate1' in tempdat[i]:
						print(tempdat[i])
						mood_day.append(tempdat[0]['day'])
						mood_date.append(temp_date)
						fr_mood_before.append(tempdat[i]['feelingRate1'])
						fr_rt_before.append(tempdat[i]['time'])
					elif 'feelingRate' in tempdat[i]:
						fr_mood_after.append(tempdat[i]['feelingRate'])
						fr_rt_after.append(tempdat[i]['time'])
					# if in this record the variable chosen is present, we can assume it is either free choice or pairs 
					elif 'chosen' in tempdat[i]: 
						#if L is present we know this is a pairs trial 
						if 'L' in tempdat[i]:
							#Fractals variables 
								#Summary Pairs
							date_pair_fr.append(temp_date)
							days_pair_fr.append(tempdat[0]['day'])
							choice_pair_fr.append(tempdat[i]['chosen'])
							#We need to return the location of chosen fractal, because of how the game stores data 
							temp_chosen = tempdat[i]['chosen']

							#from temp chosen infer the other variable 
							if temp_chosen == 'L': 
								temp_other = 'R'; 
							else: 
								temp_other = 'L';

							RT_pair_fr.append(tempdat[i]['rtime'])
							fracchosennr_pair_fr.append(tempdat[i][temp_chosen]['Index'])
							fracchosenrew_pair_fr.append(tempdat[i][temp_chosen]['Reward'])
							fracchosenprob_pair_fr.append(tempdat[i][temp_chosen]['Prob'])

							fracothernr_pair_fr.append(tempdat[i][temp_other]['Index'])
							fracotherreward_pair_fr.append(tempdat[i][temp_other]['Reward'])
							fracotherprob_pair_fr.append(tempdat[i][temp_other]['Prob'])

						#if L is not present we know it is a free choice trial 
						elif 'Index' in tempdat[i]['chosen']:
							#Free Choice
							date_free_fr.append(temp_date)
							day_free_fr.append(tempdat[0]['day'])
							print(tempdat[i]['chosen'])
							fracchosennr_free_fr.append(tempdat[i]['chosen']['Index'])
							fracchosenrew_free_fr.append(tempdat[i]['chosen']['Magnitude'])
							fracotherprob_free_fr.append(tempdat[i]['chosen']['Probability'])
				
					# elif code is present we know that this trial is a probability/magnitude guess 
					if 'code' in tempdat[i]:
						#Data summary guesses
						if tempdat[i]['code'] == 'guess - magnitude':
							
							for ii in range(5):
								date_guess_fr.append(temp_date)
								day_guess_fr.append(tempdat[0]['day'])
								fracnr_guess_fr.append(tempdat[i]['chosen'][ii]['Index'])
								fracguessmag_guess_fr.append(tempdat[i]['chosen'][ii]['guess'])
								fracmagn_guess_fr.append(tempdat[i]['chosen'][ii]['magnitude'])

								fracguessprob_guess_fr.append(numpy.nan)
								fracprob_guess_fr.append(tempdat[i]['chosen'][ii]['probability'])
						elif tempdat[i]['code'] == 'guess - probability':
							for ii in range(5):
								date_guess_fr.append(temp_date)
								day_guess_fr.append(tempdat[0]['day'])

								fracnr_guess_fr.append(tempdat[i]['chosen'][ii]['Index'])
								fracguessmag_guess_fr.append(numpy.nan)
								fracmagn_guess_fr.append(tempdat[i]['chosen'][ii]['magnitude'])

								fracguessprob_guess_fr.append(tempdat[i]['chosen'][ii]['guess'])
								fracprob_guess_fr.append(tempdat[i]['chosen'][ii]['probability'])

			# #Guess the Gap Game 
			# if temp_game_id == 'Guess the Gap':
			# 	sess_gg+= 1 
			# # first loop through the guess the gap mini game trials 
			# 	for i in range(len(tempdat))[2: -3]:				
					

			# 		#Guess the gap variables
			# 			#Data Summary Minigame
			# 		date_mini_gg.append(temp_date)
			# 		day_mini_gg.append(sess_gg)
			# 		score_mini_gg.append(tempdat[i]['score'])
			# 		RTdifference_mini_gg.append(tempdat[i]['Diff'])
			# 		delay1_mini_gg,append(tempdat[i]['Delay1'])
			# 		delay2_mini_gg.append(tempdat[i]['Delay2'])

			# 		#extra stuff that might be handy
			# 		RT_mini_gg.append(tempdat[i]['RT'])
			# 		totalScore_mini_gg.append(tempdat[i]['totalScore'])

			# 	#Seperate variables for the guesses of this game 
			# 	date_guess_gg.append(temp_date)
			# 	day_guess_gg.append(sess_gg)
			# 	preguess_guess_gg.append(tempdat[1]['rating'])
			# 	postguess_guess_gg.append(tempdat[-3]['rating'])
			# 	preguessRT_guess_gg.append(tempdat[1]['guessRT'])
			# 	postguessRT_guess_gg.append(tempdat[-3]['guessRT'])
			# 	bonuspre_guess_gg.append(tempdat[-1]['guess1Score'])
			# 	bonuspost_guess_gg.append(tempdat[-1]['guess2Score'])



	fname = input_output_path + str(part) + '_WHACKaT.csv'
	datafile = open(fname, 'w')
	datafile.write('RT, correct, trial_type, session, date, days, nr_trials, moodpre, moodpost \n')

	for i in range(len(RT_wt)):
		datafile.write('{},{},{},{},{},{},{}, {}, {} \n'.format(RT_wt[i], correct_wt[i], trial_type_wt[i], session_wt[i], date_wt[i], days_wt[i], nr_trials_wt[i], moodpreegam_wt[i], moodpostgam_wt[i]))
	datafile.close()

	
	fname = input_output_path + str(part) + '_GAMB.csv'
	datafile = open(fname, 'w')
	datafile.write('L circle prob win, L circle gain, L circle loss, R circle prob win, R circle gain, R cicle loss, choice, gain/loss, near/clear_1, near/clear_2,total score, RT, test day, actual day in study, mood pre GAMB, mood post GAMB \n')

#The gambling game is missing average mood for the day (as difficult to access cross-game) and near/clear 
	for i in range(len(Lcircleprobwin_wf)):
		datafile.write('{},{},{},{},{},{},{},{},{},{},{},{},{},{}, {}, {} \n'.format(Lcircleprobwin_wf[i], Lcirclegain_wf[i], Lcircleloss_wf[i], Rcircleprobwin_wf[i], Rcirclegain_wf[i], Rcircleloss_wf[i], Choice_wf[i], gainloss_wf[i], nearclear_1_wf[i], nearclear_2_wf[i], totalscore_wf[i], RT_wf[i], testday_wf[i], actualday_wf[i], moodpreegam_wf[i] ,moodpostgam_wf[i]))
	datafile.close()

#Frac files 

	#frac summary pairs 
	fname = input_output_path + str(part) + '_FRAC_data_summary_pairs.csv'
	datafile = open(fname, 'w')
	datafile.write('date, day, choice, RT, frac_chosen_nr, frac_chosen_rew, frac_chosen_prob, frach_other_nr, frac_other_rew, frac_other_prob \n')
	for i in range(len(date_pair_fr)):
		datafile.write('{},{},{},{},{},{},{},{},{},{} \n'.format(date_pair_fr[i], days_pair_fr[i], choice_pair_fr[i], RT_pair_fr[i], fracchosennr_pair_fr[i], fracchosenrew_pair_fr[i], fracchosenprob_pair_fr[i], fracothernr_pair_fr[i], fracotherreward_pair_fr[i], fracotherprob_pair_fr[i]))
	datafile.close()
						

	#Frac summary freechoce 
	fname = input_output_path + str(part) + '_FRAC_data_summary_freechoice.csv'
	datafile = open(fname, 'w')
	datafile.write('date, day, frac_chosen_nr, frac_chosen_rew, frac_chosen_prob \n')
	for i in range(len(date_free_fr)):
		datafile.write('{},{},{},{},{} \n'.format(date_free_fr[i], day_free_fr[i], fracchosennr_free_fr[i], fracchosenrew_free_fr[i], fracotherprob_free_fr[i]))
	datafile.close()

	#frac summary guesses 
	fname = input_output_path + str(part) + '_FRAC_data_summary_guesses.csv'
	datafile = open(fname, 'w')
	datafile.write('date, day, frac_nr, frac_guess_magn, frac_magn, frac_guess_prob, frac_prob \n')
	for i in range(len(date_guess_fr)):
		datafile.write('{},{},{},{},{}, {}, {} \n'.format(date_guess_fr[i], day_guess_fr[i], fracnr_guess_fr[i], fracguessmag_guess_fr[i], fracmagn_guess_fr[i], fracguessprob_guess_fr[i], fracprob_guess_fr[i]))
	datafile.close()
	

	fname = input_output_path + str(part) + '_FRAC_mood.csv'
	datafile = open(fname, 'w')
	datafile.write('date, day, mood_before, mood_after, rt_before, rt_after \n')
	for i in range(len(mood_date)):
			datafile.write('{},{},{},{},{},{} \n'.format(mood_date[i], mood_day[i], fr_mood_before[i], fr_mood_after[i], fr_rt_before[i], fr_rt_after[i]))
	datafile.close()



#for i in range(len(TC_data['tcid-33'])):
#print TC_data['tcid-33'][1]['data']

#print TC_data['tcid-38'][1]['data'].keys()

