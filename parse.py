
#This imports your dependencies 
import os
import json
import re
import csv
import pprint
import numpy


#acknowledge directory input 
input_dir = '/home/irvinea/Desktop/'
os.chdir(input_dir)
workingdirectory = input_dir

#participant numbers: string to list of integers []
partno = [26]


#load TrueColours JSON all participants clump, this will be GROUPED BY PARTICIPANT from TrueColours 
input_tc_path = '/home/irvinea/Downloads/caseload(5).json'
TC_data = open(input_tc_path).read()
TC_data = json.loads(TC_data)


input_output_path = '/home/irvinea/Downloads/'

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
	nearclear_wf = []
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
	fracchosenprol_pair_fr = []
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

	#Guess the gap variables
		#Data Summary Minigame
	date_mini_gg = []
	day_mini_gg = []
	score_mini_gg = []
	RTdifference_mini_gg = []
	delay1_mini_gg = []
	delay2_mini_gg = []
	#might be helpful
	RT_mini_gg = []
	totalScore_mini_gg = []

		#Data Summary Guesses
	date_guess_gg = []
	day_guess_gg = []
	preguess_guess_gg = []
	postguess_guess_gg = []
	preguessRT_guess_gg = []
	postguessRT_guess_gg = []
	bonuspre_guess_gg = []
	bonuspost_guess_gg = []

	#Counters for number of each session completed 
	sess_wt = 0
	sess_fr = 0
	sess_gg = 0
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
		else:
			valid_days.append(1)

			#This gives us the name of the game played in the session 
			temp_game_id = TC_data['tcid-' + str(part)][sess]['data']['name']
			temp_date = TC_data['tcid-' + str(part)][sess]['response_date']
			#This is our data for the session 
			tempdat = TC_data['tcid-' + str(part)][sess]['data']['response']

			#now we need a series of if conditions that read the different variables for each game: 

			#Whack-a-T Game 
			if temp_game_id == 'Whack-a-T':
				sess_wt+= 1 #register with the counter that this is a whack a T session(and one)
				#loop through all of the entries in JSON for this session (the -1 is because JSON and python work with 0 as the first number - unlike matlab)
				for i in range(len(tempdat))[1:-2]:
						print(tempdat[i]['selectedData'])
						RT_wt.append(tempdat[i]['selectedData']['rt'])

						#If they clicked a T then score correct as 1, else store it as 0 
						if tempdat[i]['selectedData']['data'] =='T':
							correct_wt.append(1)
						else:
							correct_wt.append(0)
						trial_type_wt.append(tempdat[i]['configArray']['type'])
						session_wt.append(sess_wt)
						date_wt.append(temp_date)

						#Try and look for day variable (introduced in AI's version of whack-a-t), if not there just append a NaN value 
						try:
							days_wt.append([tempdat[i]['day']])
						except:
							days_wt.append(numpy.nan)
						#Subtract 2 from the length, as the first and last two entries in a whack-a-t session will be the emotion ratings and the summary stat 
						nr_trials_wt.append(len(tempdat)-3)
						print('done')

						try: 
							moodpreegam_wt.append(tempdat[-2]['feelingRate'])
							moodpostgam_wt.append(tempdat[0]['feeingRate'])
						except:
							moodpreegam_wt.append(numpy.nan)
							moodpostgam_wt.append(numpy.nan)

			#Wheel of Fortune
			if temp_game_id == 'Wheel of Fortune':
				sess_wf+= 1 #register with the counter that this is a whack a T session(and one)
				#loop through all of the entries in JSON for this session 
				# excludes first and last items [1:-1] (as these are mode ratings)
				for i in range(len(tempdat))[1:-1]:
					try:
						Lcircleprobwin_wf.append(tempdat[i]['TrialData'][0][0])
						Lcirclegain_wf.append(tempdat[i]['TrialData'][0][1])
						Lcircleloss_wf.append(tempdat[i]['TrialData'][0][2])

						Rcircleprobwin_wf.append(tempdat[i]['TrialData'][1][0])
						Rcirclegain_wf.append(tempdat[i]['TrialData'][1][1])
						Rcircleloss_wf.append(tempdat[i]['TrialData'][1][2])	

						Choice_wf.append(tempdat[i]['side'])
						gainloss_wf.append(tempdat[i]['score'])
						totalscore_wf.append(tempdat[i]['total'])
						RT_wf.append(tempdat[i]['rt'])
						testday_wf.append(sess_wf)
						actualday_wf.append(temp_date)

						#Mood is rated on the last day 
						moodpostgam_wf.append(tempdat[-1]['feelingRate'])
						moodpreegam_wf.append(tempdat[0]['feelingRate'])
						meanmoodday_wf.append(numpy.nan)

					except:
						#the old version of the config
						Choice_wf.append(numpy.nan)
						gainloss_wf.append(tempdat[i]['score'])
						nearclear_wf.append(numpy.nan)
						totalscore_wf.append(numpy.nan)
						RT_wf.append(tempdat[i]['rt'])
						testday_wf.append(numpy.nan)
						actualday_wf.append(temp_date)
						moodpreegam_wf.append(numpy.nan)
						moodpostgam_wf.append(tempdat[20]['feelingRate'])
						meanmoodday_wf.append(numpy.nan)

			#Guess the Gap Game 
			if temp_game_id == 'Guess the Gap':
				sess_gg+= 1 
			# first loop through the guess the gap mini game trials 
				for i in range(len(tempdat))[2: -3]:				
					

					#Guess the gap variables
						#Data Summary Minigame
					date_mini_gg.append(temp_date)
					day_mini_gg.append(sess_gg)
					score_mini_gg.append(tempdat[i]['score'])
					RTdifference_mini_gg.append(tempdat[i]['Diff'])
					delay1_mini_gg,append(tempdat[i]['Delay1'])
					delay2_mini_gg.append(tempdat[i]['Delay2'])

					#extra stuff that might be handy
					RT_mini_gg.append(tempdat[i]['RT'])
					totalScore_mini_gg.append(tempdat[i]['totalScore'])

				#Seperate variables for the guesses of this game 
				date_guess_gg.append(temp_date)
				day_guess_gg.append(sess_gg)
				preguess_guess_gg.append(tempdat[1]['rating'])
				postguess_guess_gg.append(tempdat[-3]['rating'])
				preguessRT_guess_gg.append(tempdat[1]['guessRT'])
				postguessRT_guess_gg.append(tempdat[-3]['guessRT'])
				bonuspre_guess_gg.append(tempdat[-1]['guess1Score'])
				bonuspost_guess_gg.append(tempdat[-1]['guess2Score'])

			#Fractals Game 
			if temp_game_id == 'Fractals':
				car =0

	fname = input_output_path + str(part) + '_WHACKaT.csv'
	datafile = open(fname, 'w')

	for i in range(len(RT_wt)):
		if i == 0:
			datafile.write('RT, correct, trial_type, session, date, days, nr_trials, moodpre, moodpost \n')
		else:
			datafile.write('{},{},{},{},{},{},{}, {}, {} \n'.format(RT_wt[i], correct_wt[i], trial_type_wt[i], session_wt[i], date_wt[i], days_wt[i], nr_trials_wt[i], moodpreegam_wt[i], moodpostgam_wt[i]))
	datafile.close()

	
	fname = input_output_path + str(part) + '_GAMB.csv'
	datafile = open(fname, 'w')

#The gambling game is missing average mood for the day (as difficult to access cross-game) and near/clear 
	for i in range(len(RT_wt)):
		if i == 0:
			datafile.write('L curcle prob win, L circle gain, L circle loss, R circle prob win, R circle gain, R cicle loss, choice, gain/loss, total score, RT, test day, actual day in study, mood pre GAMB, mood post GAMB \n')
		else:
			datafile.write('{{},{},{},{},{},{},{},{},{},{},{},{},{},{} \n'.format(Lcircleprobwin_wf[i], Lcirclegain_wf[i], Lcircleloss_wf[i], Rcircleprobwin_wf[i], Rcirclegain_wf[i], Rcircleloss_wf[i], Choice_wf[i], gainloss_wf[i], totalscore_wf[i], RT_wf[i], testday_wf[i], actualday_wf[i], moodpreegam_wf[i] ,moodpostgam_wf[i]))
	datafile.close()





#for i in range(len(TC_data['tcid-33'])):
#print TC_data['tcid-33'][1]['data']

#print TC_data['tcid-38'][1]['data'].keys()

