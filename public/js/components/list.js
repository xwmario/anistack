/** @jsx React.DOM */

var listApp = React.createClass({
	getInitialState: function(){

		/*
			?: These integers are used to group together list items.

			1 - current
			2 - completed
			3 - planned
			4 - on hold
			5 - dropped
		*/

		/*
			WORK: Unless we want to display the manga list count,
			we could just merge 'animeList' and 'mangaList' into 'list'
			or something. Then we just have to assure that the API
			spits out the same format for anime and manga.

			Here is a suggestion on how the data should look:

			{
				"status": 1, 
				"rating": 7, 
				"progress": 12,
				"seriesTitle": "Kill la Kill", 
				"seriesTotal": 24, 
				"seriesType": "TV",
				"seriesStatus": "airing",
				"seriesImage": "http://urltoimage.jpg",
				"seriesGenres": [
					"Action",
					"Shounen"
				]
			}
		*/
		var user = {
			username: 'Mochi Umai',
			biography: 'Everything from code to pancakes. Solving the mysteries of design. I love playing games, especially TF2, so feel free to add me on steam: Mochi umai.',
			animeList: [],
			mangaList: [],
			lastSort: '', // ?: Last thing we sorted by. Used to check if we just need to reverse the sort.
			filterText: '', // ?: String, used to filter the list
			loaded: false, // ?: Displays the actual list when true
			loadError: false // ?: Displays error message if true

		}
		return user;
	},
	sortList: function(sortBy){
		if(!sortBy) sortBy = 'title';

		// FIX: As mentioned above, this type of logic separation won't hold

		if(this.props.listType === 'anime'){
			var list = this.state.animeList;
		} else {
			var list = this.state.mangaList;
		}

		_.each(list, function(listPart, index){
			if(this.state.lastSort === sortBy){
				list[index] = listPart.reverse(); // ?: There is no desc sort in underscore.js. So use reverse instead.
			} else {
				list[index] = _.sortBy(listPart, function(listItem){
					return listItem[sortBy];
				});
			}
		}.bind(this));

		this.setState({
			animeList: list,
			lastSort: sortBy
		});
	},
	filterList: function(event){
		this.setState({
			filterText: event.target.value.toLowerCase() // WORK: toLowerCase() too damn spread out. Write a method?
		});
	},
	loadList: function(list){

		// ?: Groups list objects by status and sorts them. Run only once

		if(list.length){
			var listArr = [];
			list = _.groupBy(list, 'status');
			_.each(list, function(listPart, index){
				listArr.push(_.sortBy(listPart, function(listItem){ return listItem['status'] }));
			});

			// FIX: As mentioned above, this type of logic separation won't hold.

			if(this.props.listType === 'anime'){
				this.setState({
					animeList: listArr
				});
			} else {
				this.setState({
					mangaList: listArr
				});
			}
			this.sortList();				
		}
		this.setState({
			loaded: true
		});
	},
	componentDidMount: function(){
		/*
		{
			"status": 2, 
			"rating": 7, 
			"seriesTitle": "7446828a-b703-4a7f-986c-fa205e651b75", 
			"progress": 18, 
			"seriesTotal": 10, 
			"seriesType": "ONA",
			"seriesStatus": "airing"
		}
		*/

		// FIX: Add an offline source for test data => Development without Internet access

		/*
		$.ajax({
			//url: 'http://www.json-generator.com/api/json/get/ctjyrLfuUO?indent=2', // ?: 2000 dummy list entries
			url: 'http://www.json-generator.com/api/json/get/cgaZMvksbS?indent=2', // ?: 300 dummy list entries
			//url: 'http://www.json-generator.com/api/json/get/bOpRpkgPUy?indent=2', // ?: 0 empty list
			type: 'get',
			success: function(list){
				this.loadList(list);
			}.bind(this),
			error: function(){
				this.setState({
					loaded: true,
					loadError: true
				});
			}.bind(this)
		}); */

		this.loadList([
			{
				status: 2, 
				rating: 10, 
				title: "Kill la Kill", 
				progress: 24, 
				total: 24, 
				type: "TV"
			},
			{
				status: 1, 
				rating: 7, 
				title: "Tamako Market", 
				progress: 10, 
				total: 12, 
				type: "TV"
			},
			{
				status: 1, 
				rating: 0, 
				title: "Garden of Words", 
				progress: 0, 
				total: 1, 
				type: "Movie"
			},
			{
				status: 2, 
				rating: 8, 
				title: "K-ON!", 
				progress: 12, 
				total: 12, 
				type: "TV"
			}
		]);
	},
	render: function(){
		return (
			<div>
				<div id="list-left">
					<div id="list-top">
						<div id="list-filter-wrap">
							<input type="text" max-length="50" id="list-filter-input" placeholder="Filter by title..." onChange={this.filterList} />
						</div>
					</div>
					<div id="list-sort">
						<div id="list-sort-title" className="list-sort-hd" onClick={this.sortList.bind(this, 'title')}>
							Title
						</div>
						<div id="list-sort-progress" className="list-sort-hd" onClick={this.sortList.bind(this, 'progress')}>
							Progress
						</div>
						<div id="list-sort-rating" className="list-sort-hd" onClick={this.sortList.bind(this, 'rating')}>
							Rating
						</div>
						<div id="list-sort-type" className="list-sort-hd" onClick={this.sortList.bind(this, 'type')}>
							Type
						</div>
					</div>
					<list 
						list={this.state.animeList}
						username={this.state.username}
						filterText={this.state.filterText}
						loaded={this.state.loaded}
						error={this.state.loadError}
					/>
				</div>
				<div id="list-right">
					<div id="list-profile">
						<div id="list-profile-background">
						</div>
						<div id="list-profile-avatar">
						</div>
						<div id="list-profile-name">
							{this.state.username}
						</div>
						<div id="list-profile-bio">
							<p>
								{this.state.biography}
							</p>
						</div>
					</div>
					<div className="list-nav">
						<a className="list-nav-item current">
							<span className="list-nav-text">
								Anime List
							</span>
							<span className="list-nav-count">
								// FIX: This currently doesn't display the list length
								{this.state.animeList.length}
							</span>
						</a>

						// WORK: Implement manga list as well

						<a className="list-nav-item">
							<span className="list-nav-text">
								Manga List
							</span>
							<span className="list-nav-count">
								158
							</span>
						</a>
						<a className="list-nav-item">
							<span className="list-nav-text">
								Stats
							</span>
						</a>
					</div>
				</div>
			</div>
		);
	}
});
var list = React.createClass({
	mapStatus: function(statusValue){
		
		/*
			?: Used to convert the 'index', under
			the render function, to a string.

			This function is right now pretty useless.
		*/

		// WORK: Can we solve this in another way?

		var statusList = [
			'Current',
			'Completed',
			'Planned',
			'On hold',
			'Dropped'
		];
		return statusList[statusValue];
	},
	render: function(){
		var listDOM = [];
		var totalListLength = 0;

		_.each(this.props.list, function(listPart, index){
			var listLength = 0;
			listPart = listPart.map(function(item, index){ // FIX: Change this to _id later
				if(this.props.filterText != ''){
					var filterCondition = (
						item.title.toLowerCase().indexOf(this.props.filterText) > -1 ||
						item.type.toLowerCase().indexOf(this.props.filterText) > -1
					);

					if(filterCondition){ // WORK: Needs to have more fuzzyness in the future
						listLength++;
						return (<div key={index}><listItem item={item} /></div>)
					} else {
						return false;
					}
				} else {
					listLength++;
					return (<div key={index}><listItem item={item} /></div>);
				}
			}.bind(this));

			if(listLength){ // ?: Only render list headers if list has items
				listDOM.push(
					<div key={index + 'lel'} className={ // FIX: Let this have index as key one _id is used for listItems
						React.addons.classSet({
							'list-itemstatus-wrap': true,
							'current': (index === 0) // ?: When index is 0, the current listPart status is "current"
						})
					}>
						<div className="list-itemstatus-tag">
							{this.mapStatus(index)}
						</div>
						<div className="list-itemstatus-line">
						</div>
					</div>
				)
				listDOM.push(listPart);
			}
		}.bind(this));

		// WORK: Separate the 'listDOM.push(...)' logic into a separate function
		
		if(this.props.error){

			// ?: If the componentWillMount (loading the list) call fails, this is displayed

			// WORK: Maybe this should be more informative. E.g. direct the user to a status page.

			listDOM.push(
				<div id="list-error">
					<div id="list-error-image" className="icon-support">
					</div>
					<div id="list-error-title">
						Sorry! Herro is experiencing some problems.
					</div>
					<p id="list-error-desc">
						We are already on the case and will resolve this issue as soon as possible.
						Feel free to contact us if this issue persists.
					</p>
				</div>
			);
		} else if(!listDOM.length && this.props.list.length){
			// ?: If listDOM is empty, but we still have list entries, then it means that we can't find anything that matches the filterText
			listDOM.push(<div id="list-noresults">No matching entries were found</div>);
		} else if(!this.props.list.length && this.props.loaded){
			// ?: Empty list. Display a message that asks the user to make some list entries, a.k.a onboarding
			listDOM.push(
				<div id="list-onboard">
					<div id="onboard-welcome">
						Let's get started quickly.
					</div>
					<div id="onboard-wrap">
						<div id="onboard-left" className="onboard-option">
							<div className="onboard-image icon-book-2">
							</div>
							<div className="onboard-title">
								Start adding entries to a new list
							</div>
							<div className="onboard-desc">
								Super easy to do. We'll help you get started with tracking your favorite series in no time!
							</div>
							<a id="onboard-btn-new" className="onboard-btn">
								Start with fresh list
							</a>
						</div>
						<div id="onboard-sep">
						</div>
						<div id="onboard-right" className="onboard-option">
							<div className="onboard-image icon-book-lines-2">
							</div>
							<div className="onboard-title">
								Sync with an already existing list
							</div>
							<div className="onboard-desc">
								If you already have a list, we can help you keep 
								things synced across platforms.
								<br />
								<span className="onboard-tiny">
									(even if you never ever will use something besides Herro....right?)
								</span>
							</div>
							<a id="onboard-btn-sync" className="onboard-btn">
								Sync from old list
							</a>
						</div>
					</div>
				</div>
			);
		}

		return (<div id="list">{listDOM}</div>);
	}
});

var listItem = React.createClass({
	render: function(){
		return (
			<div className="list-item">
				<div className="list-item-content">
					<div className="list-item-left">
						<div className="list-item-title">
							{this.props.item.title}
						</div>
					</div>
					<div className="list-item-right">
						<div className={
							React.addons.classSet({
								'list-item-plusone': true,
								'icon-plus': true,
								'hidden': (this.props.item.status === 2) // ?: Hide the 'plus-one' button if list item is under 'completed'
							})
						} onClick={this.updateProgress}>
						</div>
						<div className="list-item-progress">
							<span className="list-progress-current">{this.props.item.progress}</span>
							<span className="list-progress-sep">/</span>
							<span className="list-progress-total">{this.props.item.total}</span>
						</div>
						<div className="list-item-rating">
							<span className={
								React.addons.classSet({
									"list-rating-icon": true,
									"icon-heart-full": this.props.item.rating,
									"icon-heart-empty": !this.props.item.rating
								})
							}></span>
							<span className="list-rating-number">
								{
									(this.props.item.rating) ? this.props.item.rating / 2 : '—' // ?: Divide score by two, or display m-dash
								}
							</span>
						</div>
						<div className="list-item-type">
							<span className="list-type-icon tv">{this.props.item.type}</span>
						</div>
					</div>
				</div>
				<div className="list-item-expanded">
				</div>
			</div>
		)
	}
});
React.renderComponent(<listApp listType="anime" />, document.getElementById('list-wrap'));