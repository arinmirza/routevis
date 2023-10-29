<script>
	import { goto } from '$app/navigation';
	import Github from '$lib/svg/Github.svelte';
	import { fade } from 'svelte/transition';
</script>

<div class="hero min-h-screen" style="background-image: url('/images/bg.jpeg');">
	<div class="hero-overlay bg-opacity-95" />

	<div class="hero-content text-center text-neutral-content">

        <div class="card bg-base-100 shadow-xl">
            <div class="card-body">

		<div class="grid max-w-3xl justify-items-center">
            <img class="pb-6" src="/images/routevis.svg" width="50%" height="50%" style="fill: white" alt="Routevis logo"/>
			<h1 class="pb-5 text-5xl font-bold">Supply Route Optimization</h1>
			
            <!--
            <p class="pt-6 pb-12 max-w-md">
				Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti
				eaque aut repudiandae et a id nisi.
			</p>
            -->

            <div class="p-3"></div>

            <div class="w-full" >
                <button class="btn btn-primary btn-lg text-xl" style="width: calc(60% + 4rem);" 
                on:click={() => goto('/compute')}>Get Started Now</button>
            </div>

            <div class="pb-8" />

                    <h1 class="pb-1 text-2xl font-bold">Developed by </h1>


                    <div class="flex flex-row items-center contents-center">
                        <!-- Arin Mirza-->
                        <div class="flex flex-col items-center p-8">
                            <div class="avatar">
                                <div class="w-28 rounded-full ring ring-neutral-content ring-offset-base-100 ring-offset-2">
                                    <img src="/images/arin-mirza.jpg" alt="Arin Mirza" />
                                </div>
                            </div>
                            <div>
                                <div class="pt-4 font-bold">Arın Mirza</div>
                                <div><a href="https://github.com/arinmirza">github.com/arinmirza</a></div>
                            </div>
                        </div>
        
                        <!-- Metehan Kaya -->
                        <div class="flex flex-col items-center p-8">
                            <div class="avatar">
                                <div class="w-28 rounded-full ring ring-neutral-content ring-offset-base-100 ring-offset-2">
                                    <img src="/images/metehan-kaya.jpg" alt="Metehan Kaya" />
                                </div>
                            </div>
                            <div>
                                <div class="pt-4 font-bold">Metehan Kaya</div>
                                <div><a href="https://github.com/metehkaya">github.com/metehkaya</a></div>
                            </div>
                        </div>
        
                        <!-- Yusuf Serdar Degerli -->
                        <div class="flex flex-col items-center p-8">
                            <div class="avatar">
                                <div class="w-28 rounded-full ring ring-neutral-content ring-offset-base-100 ring-offset-2">
                                    <img src="/images/yusuf-serdar-degerli.jpg" alt="Yusuf Serdar Degerli" />
                                </div>
                            </div>
                            <div>
                                <div class="pt-4 font-bold"> Yusuf Serdar Değerli</div>
                                <div><a href="https://github.com/yusuffserdar">github.com/yusuffserdar</a></div>
                            </div>
                        </div>
                    </div>


                    <div class="pt-4 pb-4">
                        <p style="font-style: italic">With special thanks to our advisor 
                            Christoph Kerscher <br/>
                            for his insightful guidance throughout the project.</p>
                    </div>

                    

                    <div class="flex flex-col items-center">
                        <div>
                            <a href='https://github.com/arinmirza/routevis'>
                                <div style="transform: scale(2);"><Github /></div>
                            </a>
                            
                        </div>
                    </div>
                    
                
              </div>

            

		
			
		</div>
    </div>


        

	</div>
</div>
